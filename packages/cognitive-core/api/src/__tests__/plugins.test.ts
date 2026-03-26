import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { authPlugin } from '../plugins/auth.plugin.js';
import { opentelemetryPlugin } from '../plugins/opentelemetry.plugin.js';
import { rateLimitPlugin } from '../plugins/rate-limit.plugin.js';
import { swaggerPlugin } from '../plugins/swagger.plugin.js';
import { validationPlugin } from '../plugins/validation.plugin.js';
import { healthRoute } from '../routes/health.route.js';

const originalEnv = {
  MURMURA_WORKSPACE_DIR: process.env.MURMURA_WORKSPACE_DIR,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL,
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL,
  NODE_ENV: process.env.NODE_ENV,
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  JAEGER_ENDPOINT: process.env.JAEGER_ENDPOINT
};

let workspaceRoot: string;

beforeEach(async () => {
  workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'murmura-api-tests-'));
  process.env.MURMURA_WORKSPACE_DIR = workspaceRoot;
  process.env.JWT_ACCESS_SECRET = 'access_secret_for_tests';
  process.env.JWT_REFRESH_SECRET = 'refresh_secret_for_tests';
  process.env.JWT_ACCESS_TTL = '15m';
  process.env.JWT_REFRESH_TTL = '1d';
  process.env.NODE_ENV = 'test';
  process.env.JAEGER_ENDPOINT = 'http://jaeger.test';
});

afterEach(async () => {
  await fs.rm(workspaceRoot, { recursive: true, force: true });
  vi.restoreAllMocks();

  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe('authPlugin', () => {
  it('issues, rotates and revokes JWT tokens', async () => {
    const app = Fastify();
    await app.register(authPlugin);

    app.get('/v1/health/token', async (_request, reply) =>
      reply.issueTokens({ userId: 'user-auth' })
    );
    app.post('/v1/health/refresh', async (request, reply) => {
      const body = request.body as { refreshToken: string };
      const rotated = reply.rotateRefreshToken(body.refreshToken);
      if (!rotated) {
        reply.code(401);
        return { error: 'invalid_refresh' };
      }
      return rotated;
    });
    app.post('/v1/health/revoke', async (request, reply) => {
      const body = request.body as { refreshToken: string };
      return { revoked: reply.revokeRefreshToken(body.refreshToken) };
    });
    app.get('/protected', async (request) => ({
      userId: request.user?.userId,
      workspace: request.user?.workspace,
      permissions: request.user?.permissions
    }));

    await app.ready();

    const tokenResponse = await app.inject({ method: 'GET', url: '/v1/health/token' });
    const issued = tokenResponse.json() as {
      accessToken: string;
      refreshToken: string;
      refreshExpiresAt: string;
    };

    expect(tokenResponse.statusCode).toBe(200);
    expect(issued.accessToken).toBeTruthy();
    expect(issued.refreshToken).toBeTruthy();
    expect(new Date(issued.refreshExpiresAt).getTime()).toBeGreaterThan(Date.now());

    const protectedResponse = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        authorization: `Bearer ${issued.accessToken}`
      }
    });
    const protectedBody = protectedResponse.json() as {
      userId: string;
      workspace: string;
      permissions: string[];
    };

    expect(protectedResponse.statusCode).toBe(200);
    expect(protectedBody.userId).toBe('user-auth');
    expect(protectedBody.permissions).toContain('analyze:read');

    const rotatedResponse = await app.inject({
      method: 'POST',
      url: '/v1/health/refresh',
      payload: { refreshToken: issued.refreshToken }
    });
    const rotated = rotatedResponse.json() as {
      accessToken: string;
      refreshToken: string;
    };

    expect(rotatedResponse.statusCode).toBe(200);
    expect(rotated.refreshToken).not.toBe(issued.refreshToken);

    const revokedResponse = await app.inject({
      method: 'POST',
      url: '/v1/health/revoke',
      payload: { refreshToken: rotated.refreshToken }
    });
    expect(revokedResponse.json()).toEqual({ revoked: true });

    const refreshAfterRevoke = await app.inject({
      method: 'POST',
      url: '/v1/health/refresh',
      payload: { refreshToken: rotated.refreshToken }
    });

    expect(refreshAfterRevoke.statusCode).toBe(401);

    await app.close();
  });

  it('rejects missing and invalid access tokens', async () => {
    const app = Fastify();
    await app.register(authPlugin);
    app.get('/protected', async () => ({ ok: true }));
    await app.ready();

    const missingHeader = await app.inject({ method: 'GET', url: '/protected' });
    expect(missingHeader.statusCode).toBe(401);

    const invalidToken = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: { authorization: 'Bearer invalid-token' }
    });
    expect(invalidToken.statusCode).toBe(401);

    const malformedHeader = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: { authorization: 'Bearer' }
    });
    expect(malformedHeader.statusCode).toBe(401);
    expect(malformedHeader.json()).toEqual({ error: 'Invalid Authorization header' });

    const wrongTokenType = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        authorization: `Bearer ${jwt.sign(
          { sub: 'user-auth', type: 'refresh' },
          process.env.JWT_ACCESS_SECRET ?? 'access_secret_for_tests'
        )}`
      }
    });
    expect(wrongTokenType.statusCode).toBe(401);
    expect(wrongTokenType.json()).toEqual({ error: 'Invalid token type' });

    await app.close();
  });

  it('returns null or false for invalid refresh token operations', async () => {
    const app = Fastify();
    await app.register(authPlugin);

    app.post('/v1/health/refresh', async (request, reply) => {
      const body = request.body as { refreshToken: string };
      return { rotated: reply.rotateRefreshToken(body.refreshToken) };
    });
    app.post('/v1/health/revoke', async (request, reply) => {
      const body = request.body as { refreshToken: string };
      return { revoked: reply.revokeRefreshToken(body.refreshToken) };
    });

    await app.ready();

    const refresh = await app.inject({
      method: 'POST',
      url: '/v1/health/refresh',
      payload: { refreshToken: 'not-a-token' }
    });
    expect(refresh.statusCode).toBe(200);
    expect(refresh.json()).toEqual({ rotated: null });

    const revoke = await app.inject({
      method: 'POST',
      url: '/v1/health/revoke',
      payload: { refreshToken: 'not-a-token' }
    });
    expect(revoke.statusCode).toBe(200);
    expect(revoke.json()).toEqual({ revoked: false });

    await app.close();
  });
});

describe('rateLimitPlugin', () => {
  it('returns standard rate-limit headers and blocks after analyze threshold', async () => {
    const app = Fastify();
    await app.register(rateLimitPlugin);
    app.get('/v1/analyze', async () => ({ ok: true }));
    await app.ready();

    for (let index = 0; index < 20; index += 1) {
      const response = await app.inject({ method: 'GET', url: '/v1/analyze' });
      expect(response.statusCode).toBe(200);
      expect(response.headers['x-ratelimit-limit']).toBe('20');
    }

    const blocked = await app.inject({ method: 'GET', url: '/v1/analyze' });
    const payload = blocked.json() as { error: string; scope: string };

    expect(blocked.statusCode).toBe(429);
    expect(payload.error).toBe('Rate limit exceeded');
    expect(payload.scope).toBe('endpoint');
    expect(blocked.headers['retry-after']).toBeTruthy();

    await app.close();
  });

  it('applies the default endpoint policy on non analyze routes', async () => {
    const app = Fastify();
    await app.register(rateLimitPlugin);
    app.get('/v1/context', async () => ({ ok: true }));
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/v1/context' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-ratelimit-limit']).toBe('60');
    expect(response.headers['x-ratelimit-remaining']).toBe('59');

    await app.close();
  });
});

describe('validationPlugin', () => {
  it('formats validation failures with detailed field paths', async () => {
    const app = Fastify();
    await app.register(validationPlugin);

    app.post('/validate', async (request) => {
      const body = app.validateBody(
        z.object({
          name: z.string().min(2),
          age: z.number().int().positive()
        }),
        request.body
      );

      return body;
    });

    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/validate',
      headers: { 'x-request-id': 'req-validation' },
      payload: { name: 'A', age: -1 }
    });
    const payload = response.json() as {
      error: string;
      message: string;
      requestId: string;
      details: Array<{ path: string; reason: string }>;
    };

    expect(response.statusCode).toBe(400);
    expect(payload.error).toBe('VALIDATION_ERROR');
    expect(payload.requestId).toBe('req-validation');
    expect(payload.details.some((detail) => detail.path === 'body.name')).toBe(true);
    expect(payload.details.some((detail) => detail.path === 'body.age')).toBe(true);

    await app.close();
  });

  it('validates query, params and response payloads and preserves generic errors', async () => {
    const app = Fastify();
    await app.register(validationPlugin);

    app.get('/items/:itemId', async (request) => {
      const params = app.validateParams(
        z.object({
          itemId: z.string().uuid()
        }),
        request.params
      );
      const query = app.validateQuery(
        z.object({
          limit: z.coerce.number().int().positive()
        }),
        request.query
      );

      return app.validateResponse(
        z.object({
          id: z.string(),
          limit: z.number()
        }),
        {
          id: params.itemId,
          limit: query.limit
        }
      );
    });

    app.get('/boom', async () => {
      throw new Error('unexpected');
    });

    await app.ready();

    const paramsError = await app.inject({
      method: 'GET',
      url: '/items/not-a-uuid?limit=-1'
    });
    expect(paramsError.statusCode).toBe(400);
    expect((paramsError.json() as { details: Array<{ path: string }> }).details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'params.itemId' })
      ])
    );

    const success = await app.inject({
      method: 'GET',
      url: '/items/550e8400-e29b-41d4-a716-446655440000?limit=2'
    });
    expect(success.statusCode).toBe(200);
    expect(success.json()).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      limit: 2
    });

    const genericError = await app.inject({
      method: 'GET',
      url: '/boom'
    });
    expect(genericError.statusCode).toBe(500);

    await app.close();
  });
});

describe('opentelemetryPlugin', () => {
  it('injects request and trace identifiers into the response', async () => {
    const app = Fastify();
    await app.register(opentelemetryPlugin);

    app.get('/trace', async (request) => ({
      traceId: request.span?.traceId,
      spanName: request.span?.name,
      exporter: request.span?.attributes['otel.exporter']
    }));

    await app.ready();

    const response = await app.inject({
      method: 'GET',
      url: '/trace',
      headers: {
        'x-request-id': 'req-otel',
        'x-trace-id': 'trace-123'
      }
    });
    const payload = response.json() as {
      traceId: string;
      spanName: string;
      exporter: string;
    };

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toBe('req-otel');
    expect(response.headers['x-trace-id']).toBe('trace-123');
    expect(payload.traceId).toBe('trace-123');
    expect(payload.spanName).toBe('GET /trace');
    expect(payload.exporter).toBe('jaeger');

    await app.close();
  });
});

describe('swaggerPlugin', () => {
  it('exposes the generated OpenAPI document', async () => {
    const app = Fastify();
    await app.register(swaggerPlugin);
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/openapi.json' });
    const payload = response.json() as {
      info: { title: string; version: string };
      components: { securitySchemes: { bearerAuth: { scheme: string } } };
    };

    expect(response.statusCode).toBe(200);
    expect(payload.info.title).toBe('Murmura API');
    expect(payload.components.securitySchemes.bearerAuth.scheme).toBe('bearer');

    await app.close();
  });
});

describe('healthRoute', () => {
  it('marks failing checks as down when they throw', async () => {
    const app = Fastify();
    await app.register(healthRoute, {
      prefix: '/health',
      checks: {
        database: async () => ({ status: 'up' }),
        redis: async () => {
          throw new Error('redis crashed');
        }
      }
    });
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/health/' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'degraded',
      checks: {
        database: { status: 'up' },
        redis: { status: 'down', message: 'redis crashed' }
      }
    });

    await app.close();
  });

  it('reports auth configuration issues when JWT secrets are missing', async () => {
    const previousAccess = process.env.JWT_ACCESS_SECRET;
    const previousRefresh = process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_REFRESH_SECRET;

    const app = Fastify();
    await app.register(healthRoute, { prefix: '/health' });
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/health/' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: 'degraded',
      checks: {
        authConfig: {
          status: 'down',
          message: 'JWT secrets are not fully configured'
        }
      }
    });

    await app.close();

    if (previousAccess === undefined) {
      delete process.env.JWT_ACCESS_SECRET;
    } else {
      process.env.JWT_ACCESS_SECRET = previousAccess;
    }

    if (previousRefresh === undefined) {
      delete process.env.JWT_REFRESH_SECRET;
    } else {
      process.env.JWT_REFRESH_SECRET = previousRefresh;
    }
  });
});
