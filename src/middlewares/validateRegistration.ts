import { ApiRequest, RegistrationParams } from '@/types/request';
import { Response, NextFunction } from 'express';
import { BadRequestError } from '@/utils/errors';

// Validate provider middleware
export const validateRegistration = async (
  req: ApiRequest,
  _: Response,
  next: NextFunction,
) => {
  const requestParams = req.body as RegistrationParams;
  if (!requestParams.email && !requestParams.password) {
    throw new BadRequestError('Email and password are required');
  }
  next();
};
