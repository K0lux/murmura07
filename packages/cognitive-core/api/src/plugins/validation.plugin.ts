import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { ZodSchema } from 'zod';

async function validationPluginHandler(app: FastifyInstance) {
  app.decorate('validateBody', <T>(schema: ZodSchema<T>, body: unknown) =>
    validate(schema, body, 'body')
  );
  app.decorate('validateQuery', <T>(schema: ZodSchema<T>, query: unknown) =>
    validate(schema, query, 'query')
  );
  app.decorate('validateParams', <T>(schema: ZodSchema<T>, params: unknown) =>
    validate(schema, params, 'params')
  );
  app.decorate('validateResponse', <T>(schema: ZodSchema<T>, payload: unknown) =>
    validate(schema, payload, 'response')
  );

  app.setErrorHandler((error, request, reply) => {
    const validationError = asValidationError(error);
    if (validationError) {
      reply.code(validationError.statusCode).send({
        error: validationError.code,
        message: validationError.message,
        details: validationError.details,
        requestId: request.headers['x-request-id'] ?? null
      });
      return;
    }

    reply.send(error);
  });
}

export const validationPlugin = fp(validationPluginHandler, { name: 'validation-plugin' });

function validate<T>(schema: ZodSchema<T>, input: unknown, source: string): T {
  const parsed = schema.safeParse(input);
  if (parsed.success) {
    return parsed.data;
  }

  const details = parsed.error.issues.map((issue) => ({
    path: [source, ...issue.path].join('.'),
    reason: issue.message
  }));

  const error = new Error(`Validation failed for ${source}`) as Error & {
    statusCode: number;
    code: 'VALIDATION_ERROR';
    details: Array<{ path: string; reason: string }>;
  };
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  error.details = details;
  throw error;
}

function asValidationError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return null;
  }

  const candidate = error as {
    statusCode?: unknown;
    code?: unknown;
    details?: unknown;
    message?: unknown;
  };

  if (
    candidate.statusCode === 400 &&
    candidate.code === 'VALIDATION_ERROR' &&
    Array.isArray(candidate.details)
  ) {
    return {
      statusCode: 400,
      code: 'VALIDATION_ERROR' as const,
      message:
        typeof candidate.message === 'string' ? candidate.message : 'Validation failed',
      details: candidate.details
    };
  }

  return null;
}
