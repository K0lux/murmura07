import { z } from 'zod';
import {
  RelationshipNodeSchema,
  RelationshipTypeSchema,
  FrequencyMetricsSchema,
  RelationshipPromiseSchema
} from '../schemas/relationship.schema.js';

export type RelationshipNode = z.infer<typeof RelationshipNodeSchema>;
export type RelationshipType = z.infer<typeof RelationshipTypeSchema>;
export type FrequencyMetrics = z.infer<typeof FrequencyMetricsSchema>;
export type Promise_ = z.infer<typeof RelationshipPromiseSchema>;

