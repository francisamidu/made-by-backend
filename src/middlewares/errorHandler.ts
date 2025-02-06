// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ErrorResponse } from '../types/error';
import logger from '@/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log error details, including request info
  logger.error(`${err.name}: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err instanceof AppError ? err.stack : undefined,
    ...(err instanceof AppError ? err : {}),
  });

  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: string | undefined = undefined;

  // Handle known errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.name;
  }

  // Construct error response
  const response: ErrorResponse = {
    success: false,
    status: statusCode,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
}
