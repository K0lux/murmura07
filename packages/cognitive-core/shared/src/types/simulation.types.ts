import { z } from 'zod';
import { SimulationResultSchema, LongTermImpactSchema } from '../schemas/simulation.schema.js';

export type SimulationResult = z.infer<typeof SimulationResultSchema>;
export type LongTermImpact = z.infer<typeof LongTermImpactSchema>;

