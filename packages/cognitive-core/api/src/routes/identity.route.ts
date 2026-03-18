import { FastifyInstance } from 'fastify';

export async function identityRoute(app: FastifyInstance) {
  app.get('/', async () => ({ status: 'ok' }));
}
