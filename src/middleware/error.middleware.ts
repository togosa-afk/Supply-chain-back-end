import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const isDev = process.env.NODE_ENV !== 'production';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ERROR]', error);

  if (error instanceof z.ZodError) {
    const message = error.issues[0]?.message || 'Validation error';
    res.status(400).json({ message, errors: error.issues });
  } else if (error instanceof Error) {
    res.status(500).json({
      message: error.message,
      ...(isDev && { stack: error.stack }),
    });
  } else {
    res.status(500).json({
      message: 'Internal server error',
      ...(isDev && { error: String(error) }),
    });
  }
};
