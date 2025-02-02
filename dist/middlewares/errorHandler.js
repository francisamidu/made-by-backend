// src/middleware/errorHandler.ts
import { AppError } from '../utils/errors';
import logger from '@/logger';
export function errorHandler(err, req, res, _next) {
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
    let errors = undefined;
    let details = undefined;
    // Handle known errors
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.name;
    }
    // In development, include stack trace
    if (process.env.NODE_ENV === 'development') {
        details = err.stack;
    }
    // Construct error response
    const response = {
        details,
        success: false,
        status: statusCode,
        message,
    };
    if (errors) {
        response.errors = errors;
    }
    res.status(statusCode).json(response);
}
