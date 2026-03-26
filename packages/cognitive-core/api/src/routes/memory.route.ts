import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { MemorySearchEngine } from '@murmura/cognitive-core-memory';

const SearchSchema = z.object({
  query: z.string().min(1)
});

export async function memoryRoute(app: FastifyInstance) {
  const engine = new MemorySearchEngine();

  app.get('/search', async (request) => {
    const query = app.validateQuery(SearchSchema, request.query);
    const userId = request.user?.userId ?? 'anonymous';
    return engine.search(userId, query.query);
  });
}
