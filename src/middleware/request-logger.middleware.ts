import { NextFunction, Request, Response } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const body =
    req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0
      ? req.body
      : undefined;

  if (body) {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`, body);
  } else {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  }

  next();
};
