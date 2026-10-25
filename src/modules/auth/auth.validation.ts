import { z } from 'zod';
import { UserRole } from './auth.types';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(UserRole).default(UserRole.CUSTOMER),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const allowedRoles = Object.values(UserRole).filter((r) => r !== UserRole.SUPER_ADMIN);

export const updateRoleSchema = z.object({
  role: z.nativeEnum(UserRole, {
    error: () => ({
      message: `Role must be one of: ${allowedRoles.join(', ')}`,
    }),
  }).refine((role) => role !== UserRole.SUPER_ADMIN, {
    message: 'Assigning SUPER_ADMIN role is not allowed',
  }),
});

// Keep for backward compatibility
export const entrySchema = registerSchema;
