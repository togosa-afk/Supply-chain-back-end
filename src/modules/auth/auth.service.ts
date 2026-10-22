import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UserRole, type globalRole } from './auth.types';
import { userRepository } from './auth.repository';
import type { RegisterDto, LoginResponseDto, UserResponseDto } from './auth.dto';

const register = async (data: RegisterDto): Promise<void> => {
  const existing = await userRepository.findByEmail(data.email);
  if (existing) throw new Error('EMAIL_EXISTS');

  const passwordHash = await bcrypt.hash(data.password, 10);
  await userRepository.create({
    ...data,
    password: passwordHash,
    role: UserRole.CUSTOMER,
  });
};

const login = async (email: string, password: string): Promise<LoginResponseDto> => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('USER_NOT_FOUND');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error('INVALID_CREDENTIALS');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const updateRole = async (email: string, role: globalRole): Promise<UserResponseDto> => {
  
  if ((role as UserRole) === UserRole.SUPER_ADMIN) {
    throw new Error('FORBIDDEN_ROLE');
  }

  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('USER_NOT_FOUND');

  if (user.role !== UserRole.CUSTOMER) {
    throw new Error("CAN'T_CHANGE_ROLE");
  }

  await userRepository.updateRole(user.id, role);
  
  return { id: user.id, name: user.name, email: user.email, role };
};

export const authService = {
  register,
  login,
  updateRole,
};