import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { entrySchema } from '../modules/auth/auth.validation';

export const newUserParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    entrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
}

export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues });
  } else if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "internal server error" });
  }
};