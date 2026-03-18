import { z } from 'zod';
import { AlertSchema, AlertTypeSchema, AlertSeveritySchema } from '../schemas/alert.schema.js';

export type Alert = z.infer<typeof AlertSchema>;
export type AlertType = z.infer<typeof AlertTypeSchema>;
export type AlertSeverity = z.infer<typeof AlertSeveritySchema>;

