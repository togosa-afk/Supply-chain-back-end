import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { entrySchema } from './modules/auth/auth.validation';

export const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    entrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
}

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};