import { z } from 'zod';
import { NonEmptyStringSchema } from './common.schema.js';

export const AlertTypeSchema = z.enum([
  'high_tension',
  'broken_promise',
  'pattern_detected',
  'autonomy_limit_reached',
  'ethical_boundary'
]);

export const AlertSeveritySchema = z.enum(['info', 'warning', 'critical']);

export const AlertSchema = z.object({
  type: AlertTypeSchema,
  severity: AlertSeveritySchema,
  message: NonEmptyStringSchema,
  triggeredBy: NonEmptyStringSchema
});

