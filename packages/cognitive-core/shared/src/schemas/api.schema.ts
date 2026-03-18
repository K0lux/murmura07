import { z } from 'zod';
import { RawMessageSchema } from './message.schema.js';
import { MurmuraResponseSchema } from './response.schema.js';
import { IdSchema, NonEmptyStringSchema } from './common.schema.js';

export const MurmuraRequestSchema = z.object({
  requestId: IdSchema,
  message: RawMessageSchema
});

export const ErrorResponseSchema = z.object({
  requestId: IdSchema,
  error: z.object({
    code: NonEmptyStringSchema,
    message: NonEmptyStringSchema,
    stage: NonEmptyStringSchema.optional()
  }),
  partialResult: MurmuraResponseSchema.partial().optional()
});

