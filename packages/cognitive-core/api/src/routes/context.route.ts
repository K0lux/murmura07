import { FastifyInstance } from 'fastify';

export async function contextRoute(app: FastifyInstance) {
  app.get('/:sessionId', async (request) => ({ sessionId: request.params['sessionId'] }));
}
