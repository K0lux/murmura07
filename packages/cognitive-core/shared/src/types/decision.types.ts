import { z } from 'zod';
import { DecisionSchema, GeneratedReplySchema } from '../schemas/decision.schema.js';

export type Decision = z.infer<typeof DecisionSchema>;
export type GeneratedReply = z.infer<typeof GeneratedReplySchema>;

