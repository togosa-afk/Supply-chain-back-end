import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET;
if (!secretkey) {
    throw new Error('JWT_SECRET environment variable is not set');
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.includes('Bearer')) {
            res.status(401).json({ message: "authorization header required" });
            return;
        }

        const token = header?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: "missing token" });
            return;
        }

        jwt.verify(token, secretkey, (err, user) => {
            if (err) {
                res.status(403).json({ message: "invalid or expired token" });
                return;
            }
            (req as any).user = user;
            next();
        });
    } catch (err: unknown) {
        res.status(403).json({ message: "invalid or expired token" });
    }
};