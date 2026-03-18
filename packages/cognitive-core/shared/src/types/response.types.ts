import { z } from 'zod';
import { MurmuraResponseSchema } from '../schemas/response.schema.js';

export type MurmuraResponse = z.infer<typeof MurmuraResponseSchema>;

