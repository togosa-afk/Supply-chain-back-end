import { Request, Response } from 'express';
import { authService } from './auth.service';
import { UserRole, type globalRole } from './auth.types';
import { AuthRequest } from '../../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
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
        res.status(404).json({ message: 'User not found' });
      } else if (error.message === 'INVALID_CREDENTIALS') {
        res.status(401).json({ message: 'Invalid credentials' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(500).json({ message: 'Internal server error' });
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
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
