// src/middlewares/auth.ts
import { Response, NextFunction } from 'express';
import { ApiRequest } from '@/types/request';
import catchAsync from '@/utils/catchAsync';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '@/utils/jwt';
import { AppError } from '@/utils/errors';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = catchAsync(
  async (req: ApiRequest, _: Response, next: NextFunction) => {
    // Extract Authorization header
    const authHeader = req.headers.authorization;
    // Check if Authorization header exists
    if (!authHeader) {
      return next(new AppError('No token provided', 401));
    }

    // Split header and validate Bearer token format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AppError('Token format is invalid', 401));
    }

    const token = parts[1];

    try {
      // Verify token
      const decoded = await verifyJWT(token);

      // Attach user to request
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (error) {
      // Handle different types of token errors
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError('Token expired', 401));
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError('Invalid token', 401));
      }

      // Catch any other unexpected errors
      return next(new AppError('Authentication failed', 401));
    }
  },
);
