import { FastifyInstance } from 'fastify';
import { ZodSchema } from 'zod';

export async function validationPlugin(app: FastifyInstance) {
  app.decorate('validateBody', (schema: ZodSchema, body: unknown) => {
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw app.httpErrors.badRequest(parsed.error.flatten());
    }
    return parsed.data;
  });
}
