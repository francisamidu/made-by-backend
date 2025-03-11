import { ApiRequest } from '@/types/request';
import { TCreator } from '@/types/schema';
import { AppError } from '@/utils/errors';
import { NextFunction, Response } from 'express';
import passport from 'passport';
export const authenticateLocal = (
  req: ApiRequest,
  _res: Response,
  next: NextFunction,
) => {
  // Add timeout handling
  console.log(req.body);
  const authTimeout = setTimeout(() => {
    next(new AppError('Authentication process timed out', 500));
  }, 10000); // 10 seconds timeout
  passport.authenticate(
    'local',
    {
      failWithError: true,
      failureMessage: true,
      session: true,
    },
    (err: Error | unknown, user: TCreator, _info: any, _re4: any) => {
      // Clear timeout
      clearTimeout(authTimeout);
      if (err) {
        next(err);
      }
      if (!user) {
        throw new AppError('Authentication failed', 400);
      }
      console.log(user);
    },
  );
};
