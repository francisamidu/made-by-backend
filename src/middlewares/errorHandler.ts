// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ErrorResponse } from '../types/error';
import logger from '@/logger';

/**
 * Global error handling middleware
 * Processes all errors thrown during request handling and sends standardized error responses
 *
 * @param err - The error object caught during request processing
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (unused but required for middleware signature)
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log error details, including request info for debugging
  logger.error(`${err.name}: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err instanceof AppError ? err.stack : undefined,
    ...(err instanceof AppError ? err : {}),
  });

  // Set default error values for unknown errors
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  console.log({ err });
  // Construct standardized error response object
  const response: ErrorResponse = {
    success: false,
    status: statusCode,
    message,
  };

  // Send error response to client
  res.status(statusCode).json(response);
}
