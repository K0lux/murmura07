import { z } from 'zod';
import { NonEmptyStringSchema, Score01Schema } from './common.schema.js';

export const StrategySchema = z.enum([
  'respond_direct',
  'respond_diplomatic',
  'ask_clarification',
  'defer',
  'confront',
  'delegate',
  'silence'
]);

export const RecommendationSchema = z.object({
  strategy: StrategySchema,
  suggestedReply: NonEmptyStringSchema.optional(),
  delayRecommended: z.string().optional(),
  rationale: NonEmptyStringSchema,
  confidence: Score01Schema
});

