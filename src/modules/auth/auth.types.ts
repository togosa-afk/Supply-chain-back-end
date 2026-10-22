import type { z } from 'zod'
import type { entrySchema } from './auth.validation'


export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  MANUFACTURER = 'MANUFACTURER',
  LOGISTICS_PROVIDER = 'LOGISTICS_PROVIDER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
export type globalRole = Exclude<UserRole, UserRole.SUPER_ADMIN>

export interface User {
  id: string
  name: string
  email: string
  password: string
  role?: UserRole
}

export type PublicUser = Omit<User, 'password'>
export type RegisterInput = Omit<User, 'id'>

export interface LoginInput {
  email: string
  password: string
}


// types

export type newUser = z.infer<typeof entrySchema>