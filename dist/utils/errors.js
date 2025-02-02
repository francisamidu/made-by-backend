// src/utils/errors.ts
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}
export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
// Add more as needed
