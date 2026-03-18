import { z } from 'zod';
import {
  IdentityModelSchema,
  CommunicationStyleSchema,
  BiasSchema,
  MistakeSchema,
  BiasTypeSchema,
  ObjectiveSchema
} from '../schemas/identity.schema.js';

export type IdentityModel = z.infer<typeof IdentityModelSchema>;
export type CommunicationStyle = z.infer<typeof CommunicationStyleSchema>;
export type Bias = z.infer<typeof BiasSchema>;
export type Mistake = z.infer<typeof MistakeSchema>;
export type BiasType = z.infer<typeof BiasTypeSchema>;
export type Objective = z.infer<typeof ObjectiveSchema>;

