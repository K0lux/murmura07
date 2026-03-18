import { FastifyInstance } from 'fastify';

export async function rateLimitPlugin(app: FastifyInstance) {
  const counts = new Map<string, { count: number; resetAt: number }>();
  const windowMs = 60_000;
  const limit = 100;

  app.addHook('preHandler', async (request, reply) => {
    const key = request.user?.userId ?? request.ip;
    const now = Date.now();
    const entry = counts.get(key) ?? { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    counts.set(key, entry);

    if (entry.count > limit) {
      reply.code(429).send({ error: 'Rate limit exceeded' });
    }
  });
}
