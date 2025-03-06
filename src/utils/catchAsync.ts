// src/utils/catchAsync.ts

import {
  ApiRequest,
  ApiRequestHandler,
  ParamsDictionary,
  QueryDictionary,
} from '@/types/request';
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * A higher-order function that wraps async route handlers to handle promise rejections
 * This utility eliminates the need for try-catch blocks in every async route handler
 *
 * @param fn - The async route handler function to be wrapped
 * @returns A new route handler that automatically catches and forwards errors to Express error handler
 *
 */
const catchAsync = (fn: {
  (req: ApiRequest, res: Response, next: NextFunction): Promise<void>;
  (
    arg0: ApiRequest<ParamsDictionary, any, any, QueryDictionary>,
    arg1: Response<any, Record<string, any>>,
    arg2: NextFunction,
  ): any;
}) => {
  return (req: ApiRequest, res: Response, next: NextFunction): void => {
    // Wrap the execution in Promise.resolve to handle both async and sync errors
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
