import { FastifyRequest } from 'fastify';

export async function performanceMiddleware(request: FastifyRequest) {
  (request as any).startTime = Date.now();
}
