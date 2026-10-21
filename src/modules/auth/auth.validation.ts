import {z} from 'zod'
import { UserRole } from './auth.types'


export const entrySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.nativeEnum(UserRole).optional(),
})
// middleware
