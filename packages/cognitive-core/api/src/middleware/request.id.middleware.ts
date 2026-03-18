import { FastifyRequest } from 'fastify';

export async function requestIdMiddleware(request: FastifyRequest) {
  if (!request.headers['x-request-id']) {
    request.headers['x-request-id'] = `req_${Date.now()}`;
  }
}
