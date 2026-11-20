import { Request, Response } from 'express';
import { authService } from './auth.service';
import { UserRole, type globalRole } from './auth.types';
import { AuthRequest } from '../../middleware/auth.middleware';

const isDev = process.env.NODE_ENV !== 'production';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      res.status(409).json({ message: 'Email already exists' });
    } else if (error instanceof Error && error.message === 'CAN\'T_REGISTER_WITH_THIS_ROLR') {
      res.status(403).json({ message: 'Cannot assign SUPER_ADMIN role' })
    } else {
      console.error('[REGISTER ERROR]', error);
      res.status(500).json({
        message: 'Internal server error',
        ...(isDev && { error: error instanceof Error ? error.message : String(error) }),
        ...(isDev && error instanceof Error && { stack: error.stack }),
      });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ message: 'Logged in successfully', ...result });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'USER_NOT_FOUND') {
        res.status(401).json({ message: 'User not found' });
      } else if (error.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ message: 'Invalid credentials' });
      } else {
        console.error('[LOGIN ERROR]', error);
        res.status(500).json({
          message: 'Internal server error',
          ...(isDev && { error: error.message, stack: error.stack }),
        });
      }
    } else {
      console.error('[LOGIN ERROR]', error);
      res.status(500).json({
        message: 'Internal server error',
        ...(isDev && { error: String(error) }),
      });
    }
  }
};

export const updateRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.user!.email;
    const { role } = req.body;
    if (role === UserRole.SUPER_ADMIN) {
      res.status(403).json({ message: 'Cannot assign SUPER_ADMIN role' });
      return;
    }
    const user = await authService.updateRole(email, role as globalRole);
    res.status(200).json({ message: `Role updated successfully for ${email}`, user });
  } catch (error) {
    if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ message: 'User not found' });
    } else if (error instanceof Error && error.message === 'FORBIDDEN_ROLE') {
      res.status(403).json({ message: 'Cannot assign SUPER_ADMIN role' });
    } else if (error instanceof Error && error.message === 'CAN\'T_CHANGE_ROLE') {
      res.status(403).json({ message: 'Cannot change role' });
    } else {
      console.error('[UPDATE_ROLE ERROR]', error);
      res.status(500).json({
        message: 'Internal server error',
        ...(isDev && { error: error instanceof Error ? error.message : String(error) }),
        ...(isDev && error instanceof Error && { stack: error.stack }),
      });
    }
  }
};