import { z } from 'zod';
import {
  ConversationContextSchema,
  ExchangeSchema,
  PromiseSchema,
  ConflictEventSchema,
  RelationshipStateSchema,
  ObjectiveSchema,
  PatternSchema
} from '../schemas/context.schema.js';

export type ConversationContext = z.infer<typeof ConversationContextSchema>;
export type Exchange = z.infer<typeof ExchangeSchema>;
export type Promise_ = z.infer<typeof PromiseSchema>;
export type ConflictEvent = z.infer<typeof ConflictEventSchema>;
export type RelationshipState = z.infer<typeof RelationshipStateSchema>;
export type Objective = z.infer<typeof ObjectiveSchema>;
export type Pattern = z.infer<typeof PatternSchema>;

