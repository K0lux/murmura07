import { z } from 'zod';
import { StrategySchema, RecommendationSchema } from '../schemas/strategy.schema.js';

export type Strategy = z.infer<typeof StrategySchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;

