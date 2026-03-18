import { z } from 'zod';
import { StrategySchema } from './strategy.schema.js';
import { SimulationResultSchema } from './simulation.schema.js';
import { AlertSchema } from './alert.schema.js';
import { IdSchema, IsoDateSchema, NonEmptyStringSchema, Score01Schema } from './common.schema.js';

export const GeneratedReplySchema = z.object({
  content: NonEmptyStringSchema,
  tone: NonEmptyStringSchema,
  wordCount: z.number().int().min(0),
  adaptationNotes: NonEmptyStringSchema
});

export const DecisionSchema = z.object({
  id: IdSchema,
  requestId: IdSchema,
  timestamp: IsoDateSchema,
  selectedStrategy: StrategySchema,
  suggestedReply: NonEmptyStringSchema.optional(),
  alternativeReplies: z.array(GeneratedReplySchema),
  alerts: z.array(AlertSchema),
  autonomyAllowed: z.boolean(),
  requiresValidation: z.boolean(),
  explanation: NonEmptyStringSchema,
  confidence: Score01Schema,
  simulations: z.array(SimulationResultSchema).optional()
});

