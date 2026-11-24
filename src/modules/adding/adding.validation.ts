import { z } from 'zod';

// Product validation
export const productSchema = z.object({
  name: z.string().min(3, 'name is required'),
  quantity: z.number().min(1000, 'you must add more than 1000'),
  min_order_qaun: z.number(),
  max_order_qaun: z.number(),
  img_url: z.url(),
  discription: z.string().min(500, 'you must add more than 500 ch'),
  category_id: z.string().min(1, 'category_id is required'),
  unit_price: z.number().positive('unit_price must be positive')
  
}).refine((data) => data.min_order_qaun <= data.max_order_qaun, {
  message: 'min_order_qaun must be less than or equal to max_order_qaun',
  path: ['min_order_qaun'],
});
