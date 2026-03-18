import { z } from 'zod';
import { MurmuraRequestSchema, ErrorResponseSchema } from '../schemas/api.schema.js';
import { MurmuraResponseSchema } from '../schemas/response.schema.js';

export type MurmuraRequest = z.infer<typeof MurmuraRequestSchema>;
export type MurmuraResponse = z.infer<typeof MurmuraResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

