// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/AuthService';
import { AppError } from '@/utils/errors';
import { verifyJWT } from '@/utils/jwt';
import { TCreator } from '@/types/schema';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  // Extract token
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AppError('Invalid token format', 401);
  }

  // Verify token
  const decoded = await verifyJWT(token);
  if (!decoded?.id) {
    throw new AppError('Invalid token', 401);
  }

  // Get user from database
  const user = await AuthService.validateSession(token);
  if (!user) {
    throw new AppError('User not found', 401);
  }

  // Attach user to request
  req.user = user;
  next();
};
