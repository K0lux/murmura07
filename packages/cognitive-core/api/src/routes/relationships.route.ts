import { FastifyInstance } from 'fastify';

export async function relationshipsRoute(app: FastifyInstance) {
  app.get('/', async () => ({ items: [] }));
}
