import { z } from 'zod';
import {
  GovernanceRuleSchema,
  ViolationSchema,
  GovernanceContextSchema,
  GovernanceResultSchema
} from '../schemas/governance.schema.js';

export type GovernanceRule = z.infer<typeof GovernanceRuleSchema>;
export type Violation = z.infer<typeof ViolationSchema>;
export type GovernanceContext = z.infer<typeof GovernanceContextSchema>;
export type GovernanceResult = z.infer<typeof GovernanceResultSchema>;

