// src/utils/errors.ts

/**
 * Base error class for application-specific errors
 * Extends the built-in Error class with additional properties for HTTP status codes
 * and operational error flagging
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  /**
   * Creates a new AppError instance
   * @param message - Error message to display
   * @param statusCode - HTTP status code for the error
   * @param isOperational - Flag indicating if this is an operational error (default: true)
   */
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    // Restore prototype chain for proper instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace for debugging
    Error.captureStackTrace(this);
  }
}

/**
 * 400 Bad Request Error
 * Used when the request is malformed or contains invalid parameters
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized Error
 * Used when authentication is required but has failed or not been provided
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * 404 Not Found Error
 * Used when the requested resource cannot be found
 */
export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

// Add more as needed
