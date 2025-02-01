// src/utils/catchAsync.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * A higher-order function to wrap async route handlers and forward errors.
 * @param fn - Async route handler function
 * @returns A new route handler function
 */
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
