import { z } from 'zod';
import { NonEmptyStringSchema, Score01Schema } from './common.schema.js';

export const IntentionSchema = z.enum([
  'negotiation',
  'confrontation',
  'information',
  'request',
  'social',
  'threat',
  'unknown'
]);

export const UrgencyLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

export const EmotionSchema = z.enum([
  'neutral',
  'anger',
  'anxiety',
  'joy',
  'sadness',
  'pressure'
]);

export const EmotionProfileSchema = z.object({
  dominant: EmotionSchema,
  intensity: Score01Schema,
  secondary: EmotionSchema.optional()
});

export const PowerAsymmetrySchema = z.object({
  direction: z.enum(['user_dominant', 'interlocutor_dominant', 'balanced']),
  intensity: Score01Schema
});

export const MessageAnalysisSchema = z.object({
  intention: IntentionSchema,
  emotion: EmotionProfileSchema,
  tensionScore: Score01Schema,
  explicitDemand: NonEmptyStringSchema,
  implicitDemand: NonEmptyStringSchema.optional(),
  urgencyLevel: UrgencyLevelSchema,
  powerAsymmetry: PowerAsymmetrySchema,
  ambiguityScore: Score01Schema
});

