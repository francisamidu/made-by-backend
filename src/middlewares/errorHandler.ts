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
  err: Error,
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
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: string | undefined = undefined;

  // Handle known application errors with custom status codes and messages
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.name;
  }

  // Construct standardized error response object
  const response: ErrorResponse = {
    success: false,
    status: statusCode,
    message,
  };

  // Add additional error details if available
  if (errors) {
    response.errors = errors;
  }

  // Send error response to client
  res.status(statusCode).json(response);
}
