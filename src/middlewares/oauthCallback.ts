import { Response } from 'express';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';
import { NextFunction } from 'express-serve-static-core';
import passport from 'passport';

export const oAuthCallback = (
  req: ApiRequest<{
    provider: string;
  }>,
  _res: Response<
    ApiResponse<{
      provider: string;
    }>
  >,
  _next: NextFunction,
) => {
  passport.authenticate(req.params.provider, {
    session: false,
  });
};
