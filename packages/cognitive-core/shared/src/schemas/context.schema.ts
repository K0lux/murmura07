import { z } from 'zod';
import { CanalSchema } from './canal.schema.js';
import { IdSchema, IsoDateSchema, NonEmptyStringSchema, Score01Schema } from './common.schema.js';

export const PromiseStatusSchema = z.enum(['pending', 'kept', 'broken']);

export const PromiseSchema = z.object({
  id: IdSchema,
  description: NonEmptyStringSchema,
  dueAt: IsoDateSchema.optional(),
  status: PromiseStatusSchema
});

export const ConflictEventSchema = z.object({
  id: IdSchema,
  timestamp: IsoDateSchema,
  description: NonEmptyStringSchema,
  resolved: z.boolean()
});

export const RelationshipStateSchema = z.object({
  trustLevel: Score01Schema,
  tension: Score01Schema
});

export const ObjectiveSchema = z.object({
  id: IdSchema,
  description: NonEmptyStringSchema
});

export const PatternSchema = z.object({
  type: NonEmptyStringSchema,
  description: NonEmptyStringSchema,
  frequency: z.number().min(0)
});

export const ExchangeSchema = z.object({
  id: IdSchema,
  timestamp: IsoDateSchema,
  canal: CanalSchema,
  inbound: NonEmptyStringSchema,
  outbound: NonEmptyStringSchema.optional(),
  analysis: z.unknown(),
  decision: z.unknown().optional()
});

export const ConversationContextSchema = z.object({
  lastExchange: ExchangeSchema.optional(),
  previousPromises: z.array(PromiseSchema),
  conflictHistory: z.array(ConflictEventSchema),
  relationshipState: RelationshipStateSchema,
  activeObjectives: z.array(ObjectiveSchema),
  summary: NonEmptyStringSchema,
  relevantPatterns: z.array(PatternSchema)
});

