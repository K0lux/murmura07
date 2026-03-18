import { z } from 'zod';
import { MessageAnalysisSchema } from './analysis.schema.js';
import { RecommendationSchema } from './strategy.schema.js';
import { SimulationResultSchema } from './simulation.schema.js';
import { AlertSchema } from './alert.schema.js';
import { IdSchema } from './common.schema.js';

export const MurmuraResponseSchema = z.object({
  requestId: IdSchema,
  analysis: MessageAnalysisSchema,
  recommendation: RecommendationSchema,
  simulations: z.array(SimulationResultSchema),
  alerts: z.array(AlertSchema),
  autonomyAllowed: z.boolean()
});

