import { z } from 'zod';
import { EpisodeSchema, EpisodeTypeSchema, MemorySearchResultSchema } from '../schemas/memory.schema.js';

export type Episode = z.infer<typeof EpisodeSchema>;
export type EpisodeType = z.infer<typeof EpisodeTypeSchema>;
export type MemorySearchResult = z.infer<typeof MemorySearchResultSchema>;

