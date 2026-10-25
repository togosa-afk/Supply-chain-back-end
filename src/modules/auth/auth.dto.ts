import { UserRole, type globalRole } from './auth.types';

// --- Input DTOs ---
export interface RegisterDto {
  role: Omit<UserRole ,UserRole.SUPER_ADMIN>;
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// email is intentionally excluded — it is extracted from the JWT token, not the request body
export interface UpdateRoleDto {
  role: globalRole;
}

// --- Output DTOs ---
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponseDto {
  token: string;
  user: UserResponseDto;
}
