import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ message: 'Validation error', errors: error.issues });
  } else if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};
