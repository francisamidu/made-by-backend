import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

import { ZodError, z } from 'zod';

// Commented out code for future reference
// const stringBoolean = z.coerce
//   .string()
//   .transform((val) => {
//     return val === 'true';
//   })
//   .default('false');

/**
 * Environment Variable Schema Definition
 * Defines the structure and validation rules for required environment variables
 * - NODE_ENV: String with default value 'development'
 * - APP_PORT: Number for the application port
 * - DATABASE_URL: String for the database connection URL
 */
const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  APP_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
});

// Type export for TypeScript type inference
export type EnvSchema = z.infer<typeof EnvSchema>;

/**
 * Load and expand environment variables from .env file
 * expand() allows for variable interpolation in .env files
 */
expand(config());

/**
 * Validate environment variables against schema
 * Throws a formatted error if required variables are missing
 */
try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n';
    error.issues.forEach((issue) => {
      message += issue.path[0] + '\n';
    });
    const e = new Error(message);
    e.stack = '';
    throw e;
  } else {
    console.error(error);
  }
}

/**
 * Export validated environment variables
 * Returns a typed object containing all environment variables
 */
export default EnvSchema.parse(process.env);
