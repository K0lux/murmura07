import { z } from 'zod';
import { DecisionSchema } from './decision.schema.js';
import { IdSchema, NonEmptyStringSchema } from './common.schema.js';

export const GovernanceRuleSchema = z.object({
  id: IdSchema,
  description: NonEmptyStringSchema,
  category: z.enum(['hard', 'soft'])
});

export const ViolationSchema = z.object({
  rule: GovernanceRuleSchema,
  severity: z.enum(['warning', 'block']),
  description: NonEmptyStringSchema
});

export const GovernanceContextSchema = z.object({
  userId: IdSchema,
  identity: z.unknown(),
  relationship: z.unknown(),
  analysis: z.unknown()
});

export const GovernanceResultSchema = z.object({
  allowed: z.boolean(),
  violations: z.array(ViolationSchema),
  modifiedDecision: DecisionSchema.optional(),
  blockedReason: NonEmptyStringSchema.optional()
});

