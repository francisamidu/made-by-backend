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

export class ValidationError extends Error {
  public statusCode: number;
  public errors: string[];
  public isOperational: boolean;

  /**
   * Creates a new ValidationError instance
   * @param errors - Array of error messages
   * @param statusCode - HTTP status code (default: 400)
   * @param isOperational - Flag indicating if this is an operational error (default: true)
   */
  constructor(
    errors: string | string[],
    statusCode: number = 400,
    isOperational: boolean = true,
  ) {
    // Normalize errors to an array
    const errorMessages = Array.isArray(errors) ? errors : [errors];

    // Use the first error message as the main error message
    super(errorMessages[0]);

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'ValidationError';
    this.statusCode = statusCode;
    this.errors = errorMessages;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a validation error from an object of field-based errors
   * @param errorMap - Object with field names as keys and error messages as values
   * @returns ValidationError
   */
  static fromMap(errorMap: Record<string, string>): ValidationError {
    const errors = Object.entries(errorMap).map(
      ([field, message]) => `${field}: ${message}`,
    );

    return new ValidationError(errors);
  }

  /**
   * Create a validation error with a single message
   * @param message - Error message
   * @returns ValidationError
   */
  static single(message: string): ValidationError {
    return new ValidationError([message]);
  }
}
