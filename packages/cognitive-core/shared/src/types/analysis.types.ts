import { z } from 'zod';
import {
  IntentionSchema,
  UrgencyLevelSchema,
  EmotionSchema,
  EmotionProfileSchema,
  PowerAsymmetrySchema,
  MessageAnalysisSchema
} from '../schemas/analysis.schema.js';

export type Intention = z.infer<typeof IntentionSchema>;
export type UrgencyLevel = z.infer<typeof UrgencyLevelSchema>;
export type Emotion = z.infer<typeof EmotionSchema>;
export type EmotionProfile = z.infer<typeof EmotionProfileSchema>;
export type PowerAsymmetry = z.infer<typeof PowerAsymmetrySchema>;
export type MessageAnalysis = z.infer<typeof MessageAnalysisSchema>;

