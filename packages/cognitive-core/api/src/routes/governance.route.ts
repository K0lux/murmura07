import { FastifyInstance } from 'fastify';

export async function governanceRoute(app: FastifyInstance) {
  app.get('/rules', async () => ({ rules: [] }));
}
