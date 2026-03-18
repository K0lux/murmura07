import { z } from 'zod';
import { PowerAsymmetrySchema } from './analysis.schema.js';
import { IdSchema, IsoDateSchema, NonEmptyStringSchema, Score01Schema } from './common.schema.js';

export const RelationshipTypeSchema = z.enum([
  'professional_superior',
  'professional_peer',
  'professional_subordinate',
  'personal_close',
  'personal_acquaintance',
  'adversarial',
  'unknown'
]);

export const PromiseStatusSchema = z.enum(['pending', 'kept', 'broken']);

export const RelationshipPromiseSchema = z.object({
  id: IdSchema,
  description: NonEmptyStringSchema,
  dueAt: IsoDateSchema.optional(),
  status: PromiseStatusSchema
});

export const FrequencyMetricsSchema = z.object({
  last7days: z.number().min(0),
  last30days: z.number().min(0),
  averageResponseTime: z.number().min(0)
});

export const RelationshipNodeSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  interlocuteurId: IdSchema,
  trustLevel: Score01Schema,
  accumulatedTension: Score01Schema,
  powerAsymmetry: PowerAsymmetrySchema,
  interactionFrequency: FrequencyMetricsSchema,
  sensitiveTopics: z.array(NonEmptyStringSchema),
  pendingPromises: z.array(RelationshipPromiseSchema),
  relationshipType: RelationshipTypeSchema,
  healthScore: z.number().min(0).max(100),
  createdAt: IsoDateSchema,
  updatedAt: IsoDateSchema
});

