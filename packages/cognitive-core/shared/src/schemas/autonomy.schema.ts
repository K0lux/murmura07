import { z } from 'zod';
import { IdSchema } from './common.schema.js';

export const AutonomyLevelSchema = z.enum([
  'suggestion_only',
  'validation_required',
  'limited_autonomy',
  'blocked'
]);

export const AutonomyRuleSchema = z.object({
  condition: z.enum([
    'tensionScore > 0.7',
    'relationshipType === adversarial',
    'strategy === confront',
    'trustLevel < 0.3',
    'canal === email'
  ]),
  level: AutonomyLevelSchema,
  priority: z.number().int().min(0)
});

export const AutonomyConfigSchema = z.object({
  userId: IdSchema,
  defaultLevel: AutonomyLevelSchema,
  rules: z.array(AutonomyRuleSchema)
});

