import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authPlugin(app: FastifyInstance) {
  app.decorateRequest('user', null);

  app.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/docs') || request.url.startsWith('/v1/health')) {
      return;
    }

    const header = request.headers.authorization;
    if (!header) {
      reply.code(401).send({ error: 'Missing Authorization header' });
      return;
    }

    const [, token] = header.split(' ');
    if (!token) {
      reply.code(401).send({ error: 'Invalid Authorization header' });
      return;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret') as {
        sub: string;
      };
      request.user = { userId: payload.sub };
    } catch {
      reply.code(401).send({ error: 'Invalid token' });
    }
  });
}
