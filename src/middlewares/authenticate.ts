// src/middlewares/auth.ts
import { Response, NextFunction } from 'express';
import { AuthService } from '@/services/AuthService';
import { AppError, UnauthorizedError } from '@/utils/errors';
import { verifyJWT } from '@/utils/jwt';
import { ApiRequest } from '@/types/request';
import catchAsync from '@/utils/catchAsync';
import { TCreator } from '@/types/schema';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = catchAsync(
  async (req: ApiRequest, _: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Invalid token format', 401);
    }

    const decoded = await verifyJWT(token);
    if (!decoded?.id) {
      throw new UnauthorizedError('Invalid token');
    }

    const user = (await AuthService.validateSession(token)) as TCreator;
    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  },
);
