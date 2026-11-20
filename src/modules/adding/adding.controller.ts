import { Response } from 'express';
import { productService } from './adding.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const isDev = process.env.NODE_ENV !== 'production';

export const add = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    if (!userId) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const product = await productService.add(userId, req.body);
    res.status(201).json({
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ message: 'User not found' });
    } else if (error instanceof Error && error.message === 'CAN\'T_ADD_PRODUCTS_WITH_THIS_ROLR') {
      res.status(403).json({ message: 'Cannot add products with this role' });
    } else {
      console.error('[ADD_PRODUCT ERROR]', error);
      res.status(500).json({
        message: 'Internal server error',
        ...(isDev && { error: error instanceof Error ? error.message : String(error) }),
        ...(isDev && error instanceof Error && { stack: error.stack }),
      });
    }
  }
};
