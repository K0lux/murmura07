import { z } from 'zod';
import { AutonomyConfigSchema, AutonomyLevelSchema, AutonomyRuleSchema } from '../schemas/autonomy.schema.js';

export type AutonomyLevel = z.infer<typeof AutonomyLevelSchema>;
export type AutonomyRule = z.infer<typeof AutonomyRuleSchema>;
export type AutonomyConfig = z.infer<typeof AutonomyConfigSchema>;

