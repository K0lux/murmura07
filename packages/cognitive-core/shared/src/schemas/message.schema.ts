import { z } from 'zod';
import { CanalSchema } from './canal.schema.js';
import { IdSchema, IsoDateSchema, NonEmptyStringSchema } from './common.schema.js';

export const MessageMetadataSchema = z.object({
  timestamp: IsoDateSchema,
  threadId: IdSchema.optional(),
  urgencyFlag: z.boolean(),
  attachments: z.array(z.unknown()).optional()
});

export const RawMessageSchema = z.object({
  userId: IdSchema,
  canal: CanalSchema,
  interlocuteurId: IdSchema,
  content: NonEmptyStringSchema,
  metadata: MessageMetadataSchema
});

