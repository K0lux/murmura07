import { z } from 'zod';

export const CanalSchema = z.enum(['telegram', 'whatsapp', 'email', 'slack', 'sms', 'api', 'internal']);
