import { z } from 'zod';
import { CanalSchema } from '../schemas/canal.schema.js';
import { MessageMetadataSchema, RawMessageSchema } from '../schemas/message.schema.js';

export type Canal = z.infer<typeof CanalSchema>;
export type MessageMetadata = z.infer<typeof MessageMetadataSchema>;
export type RawMessage = z.infer<typeof RawMessageSchema>;

