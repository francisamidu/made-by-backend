import { ApiRequest, RegistrationParams } from '@/types/request';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ValidationError } from '@/utils/errors';
import { query, validationResult, body } from 'express-validator';
import z from 'zxcvbn';

// Validate provider middleware
export const validateAuth = async (
  req: ApiRequest,
  _: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body as RegistrationParams;
  if (!email || !password) {
    next(new BadRequestError('Email and password are required'));
  }

  next();
};
export class ValidationMiddleware {
  /**
   * Handles validation errors from express-validator
   */
  private static handleValidationErrors(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Transform validation errors into an array of messages
      const formattedErrors = errors.array().map((err) => err.msg);
      return next(new ValidationError(formattedErrors));
    }

    next();
  }

  /**
   * Wraps validation chains with error handling
   * @param validations - Array of validation chains
   * @returns Middleware array with validation and error handling
   */
  private static validate(validations: any[]) {
    return [...validations, this.handleValidationErrors];
  }

  // Authentication Validations
  static registerValidation = this.validate([
    body('email', 'Please provide an email address')
      .isEmail()
      .withMessage('Invalid email address format')
      .normalizeEmail(),

    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),

    body('fullname')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long')
      .escape(),
  ]);

  //Password strength validator
  static passwordValidator(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const { password } = req.body as unknown as RegistrationParams;
    const { score } = z(password);

    if (score < 3) {
      throw new ValidationError([
        'Your password is weak. Password must include at least 1 uppercase, lowercase, 1 number, and 1 special character',
      ]);
    }
    next();
  }

  // Login Validations
  static loginValidation = this.validate([
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),

    body('password').notEmpty().withMessage('Password is required'),
  ]);

  // Query Parameter Validations
  static searchValidation = this.validate([
    query('q')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ]);

  // Project Creation Validation
  static createProjectValidation = this.validate([
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),

    body('tags')
      .optional()
      .isArray({ max: 5 })
      .withMessage('Maximum 5 tags allowed'),

    body('tags.*')
      .trim()
      .isLength({ min: 2, max: 20 })
      .withMessage('Each tag must be between 2 and 20 characters'),
  ]);

  // File Upload Validation
  static fileUploadValidation = this.validate([
    body('file').custom((value, { req }) => {
      // TypeScript-safe file validation
      const file = req.file as Express.Multer.File | undefined;

      if (!file) {
        throw new Error('File is required');
      }

      // File size validation
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size cannot exceed 5MB');
      }

      // File type validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type');
      }

      return true;
    }),
  ]);
}
