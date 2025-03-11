import { CreateCreatorBody } from '@/types/creator';
import {
  ApiRequest,
  CreateCreatorSchema,
  CreateProjectSchema,
} from '@/types/request';
import { TCreateProjectRequest } from '@/types/schema';
import { AppError } from '@/utils/errors';
import { Request, Response, NextFunction } from 'express';

export const validateCreator = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { name, email } = req.body as Partial<CreateCreatorBody>;

  const validatedBody = CreateCreatorSchema.parse(req.body);
  if (!name || !email) {
    return next(new AppError('Name and email is required', 400));
  }
  console.log(validatedBody);
  next();
};

export const validateProject = async (
  req: Request<ApiRequest>,
  _res: Response,
  next: NextFunction,
) => {
  const body = req.body as TCreateProjectRequest;

  const validatedBody = CreateProjectSchema.parse(req.body);
};
