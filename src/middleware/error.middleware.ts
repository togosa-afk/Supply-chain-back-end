import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof z.ZodError) {
    const message = error.issues[0]?.message || 'Validation error';
    res.status(400).json({ message, errors: error.issues });
  } else if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};
