import { z } from 'zod';

export const IdSchema = z.string().min(1);
export const NonEmptyStringSchema = z.string().min(1);
export const IsoDateSchema = z.coerce.date();
export const Score01Schema = z.number().min(0).max(1);
export const PercentageSchema = z.number().min(0).max(100);
