import { z } from 'zod';
import { IdSchema, IsoDateSchema, NonEmptyStringSchema, Score01Schema } from './common.schema.js';

export const CommunicationStyleSchema = z.object({
  formality: z.enum(['low', 'medium', 'high']),
  tone: z.enum(['direct', 'diplomatic', 'warm', 'neutral'])
});

export const BiasTypeSchema = z.enum([
  'responds_too_fast_under_pressure',
  'accepts_too_easily',
  'avoids_conflict',
  'over_explains',
  'underestimates_tension'
]);

export const BiasSchema = z.object({
  type: BiasTypeSchema,
  description: NonEmptyStringSchema,
  frequency: z.number().min(0),
  lastSeen: IsoDateSchema
});

export const MistakeSchema = z.object({
  description: NonEmptyStringSchema,
  frequency: z.number().min(0)
});

export const ObjectiveSchema = z.object({
  id: IdSchema,
  description: NonEmptyStringSchema
});

export const IdentityModelSchema = z.object({
  userId: IdSchema,
  communicationStyle: CommunicationStyleSchema,
  confrontationLevel: Score01Schema,
  riskTolerance: Score01Schema,
  recurringBiases: z.array(BiasSchema),
  typicalMistakes: z.array(MistakeSchema),
  longTermObjectives: z.array(ObjectiveSchema),
  coreValues: z.array(NonEmptyStringSchema),
  updatedAt: IsoDateSchema,
  version: z.number().int().min(1)
});

