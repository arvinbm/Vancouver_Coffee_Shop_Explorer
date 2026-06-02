import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extends Express's Request type to include the authenticated user.
// Route handlers that use this middleware can safely access req.user.
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Expect header in the format: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      username: string;
    };
    req.user = decoded;
    next(); // token is valid — pass the request to the route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
