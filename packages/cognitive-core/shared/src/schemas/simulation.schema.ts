import { z } from 'zod';
import { NonEmptyStringSchema, Score01Schema } from './common.schema.js';
import { StrategySchema } from './strategy.schema.js';

export const LongTermImpactSchema = z.enum(['positive', 'neutral', 'negative', 'unknown']);

export const SimulationResultSchema = z.object({
  scenario: StrategySchema,
  suggestedReply: NonEmptyStringSchema.optional(),
  acceptanceProbability: Score01Schema,
  escalationProbability: Score01Schema,
  trustImpact: z.number().min(-1).max(1),
  longTermImpact: LongTermImpactSchema,
  timeToRespond: z.string().optional(),
  keyAssumptions: z.array(NonEmptyStringSchema).optional()
});

