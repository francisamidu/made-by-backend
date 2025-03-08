import { OAuthProvider } from '@/types/auth';
import { AppError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';

// Validate provider middleware
export const validateProvider = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const provider = req.params.provider as OAuthProvider;
  if (!['google', 'github', 'twitter'].includes(provider)) {
    throw new AppError('Invalid provider', 400);
  }
  next();
};
