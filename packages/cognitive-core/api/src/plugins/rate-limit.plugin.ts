import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function rateLimitPluginHandler(app: FastifyInstance) {
  const globalCounts = new Map<string, Bucket>();
  const userCounts = new Map<string, Bucket>();
  const endpointCounts = new Map<string, Bucket>();
  const globalPolicy: Policy = { limit: 300, windowMs: 60_000, scope: 'global' };
  const userPolicy: Policy = { limit: 120, windowMs: 60_000, scope: 'user' };

  app.addHook('preHandler', async (request, reply) => {
    const userKey = request.user?.userId ?? request.ip;
    const routePath = request.routeOptions.url ?? request.url;
    const endpointPolicy = getEndpointPolicy(routePath);

    const violations = [
      consume(globalCounts, `global:${request.ip}`, globalPolicy),
      consume(userCounts, `user:${userKey}`, userPolicy),
      consume(
        endpointCounts,
        `endpoint:${userKey}:${routePath}`,
        endpointPolicy
      )
    ];

    const mostRestrictive = violations
      .filter((result) => result.blocked)
      .sort((left, right) => left.remaining - right.remaining)[0];

    const headerSource =
      mostRestrictive ??
      violations.sort((left, right) => left.remaining - right.remaining)[0] ??
      {
        scope: endpointPolicy.scope,
        limit: endpointPolicy.limit,
        remaining: endpointPolicy.limit,
        resetAt: Date.now() + endpointPolicy.windowMs,
        blocked: false
      };
    reply.header('X-RateLimit-Limit', String(headerSource.limit));
    reply.header('X-RateLimit-Remaining', String(Math.max(0, headerSource.remaining)));
    reply.header('X-RateLimit-Reset', String(Math.ceil(headerSource.resetAt / 1000)));

    if (mostRestrictive) {
      reply.header('Retry-After', String(Math.max(1, Math.ceil((mostRestrictive.resetAt - Date.now()) / 1000))));
      request.log.warn(
        {
          userId: request.user?.userId,
          ip: request.ip,
          route: routePath,
          scope: mostRestrictive.scope
        },
        'Rate limit exceeded'
      );
      reply.code(429).send({
        error: 'Rate limit exceeded',
        scope: mostRestrictive.scope,
        limit: mostRestrictive.limit,
        resetAt: new Date(mostRestrictive.resetAt).toISOString()
      });
    }
  });
}

export const rateLimitPlugin = fp(rateLimitPluginHandler, { name: 'rate-limit-plugin' });

type Policy = {
  scope: 'global' | 'user' | 'endpoint';
  limit: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

type ConsumptionResult = {
  scope: Policy['scope'];
  limit: number;
  remaining: number;
  resetAt: number;
  blocked: boolean;
};

function getEndpointPolicy(route: string): Policy {
  if (route.includes('/v1/analyze')) {
    return { limit: 20, windowMs: 60_000, scope: 'endpoint' };
  }

  return { limit: 60, windowMs: 60_000, scope: 'endpoint' };
}

function consume(store: Map<string, Bucket>, key: string, policy: Policy): ConsumptionResult {
  const now = Date.now();
  const current = store.get(key);
  const bucket =
    current && current.resetAt > now
      ? current
      : {
          count: 0,
          resetAt: now + policy.windowMs
        };

  bucket.count += 1;
  store.set(key, bucket);

  return {
    scope: policy.scope,
    limit: policy.limit,
    remaining: Math.max(0, policy.limit - bucket.count),
    resetAt: bucket.resetAt,
    blocked: bucket.count > policy.limit
  };
}
