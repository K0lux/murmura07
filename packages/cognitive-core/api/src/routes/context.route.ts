import { FastifyInstance, FastifyRequest } from 'fastify';

type ContextRouteParams = {
  sessionId: string;
};

export async function contextRoute(app: FastifyInstance) {
  app.get('/:sessionId', async (request: FastifyRequest<{ Params: ContextRouteParams }>) => ({
    sessionId: request.params.sessionId
  }));
}
