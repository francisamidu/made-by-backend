// src/utils/catchAsync.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * A higher-order function that wraps async route handlers to handle promise rejections
 * This utility eliminates the need for try-catch blocks in every async route handler
 *
 * @param fn - The async route handler function to be wrapped
 * @returns A new route handler that automatically catches and forwards errors to Express error handler
 *
 * @example
 * // Instead of:
 * async function handler(req, res, next) {
 *   try {
 *     await someAsyncOperation();
 *   } catch (error) {
 *     next(error);
 *   }
 * }
 *
 * // You can write:
 * const handler = catchAsync(async (req, res) => {
 *   await someAsyncOperation();
 * });
 */
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Wrap the execution in Promise.resolve to handle both async and sync errors
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
