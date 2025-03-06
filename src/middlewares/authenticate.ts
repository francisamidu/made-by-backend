// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/AuthService';
import { AppError } from '@/utils/errors';
import { verifyJWT } from '@/utils/jwt';
import { ApiRequest, ApiHandler } from '@/types/request';
import catchAsync from '@/utils/catchAsync';
import { ApiResponse } from '@/types/response';
import { TCreator } from '@/types/schema';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = catchAsync(
  async (req: ApiRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Invalid token format', 401);
    }

    const decoded = await verifyJWT(token);
    if (!decoded?.id) {
      throw new AppError('Invalid token', 401);
    }

    const user = (await AuthService.validateSession(token)) as TCreator;
    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  },
);
