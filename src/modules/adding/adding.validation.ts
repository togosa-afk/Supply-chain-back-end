import { z } from 'zod';

// Product validation
export const productSchema = z.object({
  name: z.string().min(3, 'name is required'),
  quantity: z.number().min(1000, 'you must add more than 1000'),
  min_avalabil_qaun: z.number(),
  max_avalabil_qaun: z.number(),
}).refine((data) => data.min_avalabil_qaun <= data.max_avalabil_qaun, {
  message: 'min_avalabil_qaun must be less than or equal to max_avalabil_qaun',
  path: ['min_avalabil_qaun'],
});
