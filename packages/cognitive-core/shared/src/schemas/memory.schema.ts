import { z } from 'zod';
import { IdSchema, IsoDateSchema, NonEmptyStringSchema, Score01Schema } from './common.schema.js';

export const EpisodeTypeSchema = z.enum(['exchange', 'decision', 'event', 'promise', 'conflict']);

export const EpisodeSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  type: EpisodeTypeSchema,
  content: NonEmptyStringSchema,
  embedding: z.array(z.number()),
  importance: Score01Schema,
  decayFactor: Score01Schema,
  tags: z.array(NonEmptyStringSchema),
  relatedEntities: z.array(NonEmptyStringSchema),
  createdAt: IsoDateSchema
});

export const MemorySearchResultSchema = z.object({
  snippet: NonEmptyStringSchema,
  source: NonEmptyStringSchema,
  lineRange: z.tuple([z.number().int().min(1), z.number().int().min(1)]),
  score: z.number(),
  sourceType: z.enum(['memory', 'session'])
});

