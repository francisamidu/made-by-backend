import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

/**
 * Environment Variable Schema Definition
 * Defines the structure and validation rules for required environment variables
 */
const EnvSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_PORT: z.coerce.number().default(3000),
  // APP_URL: z.string().url(),
  API_PREFIX: z.string().default('/api/v1'),

  // Database
  DATABASE_URL: z.string(),
  // DATABASE_SSL: z.coerce.boolean().default(false),
  // DATABASE_MAX_CONNECTIONS: z.coerce.number().default(10),

  // // JWT Configuration
  // JWT_SECRET: z.string().min(32),
  // JWT_ACCESS_EXPIRY: z.string().default('15m'),
  // JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // // OAuth - GitHub
  // GITHUB_CLIENT_ID: z.string(),
  // GITHUB_CLIENT_SECRET: z.string(),
  // GITHUB_CALLBACK_URL: z.string().url(),

  // // OAuth - Google
  // GOOGLE_CLIENT_ID: z.string(),
  // GOOGLE_CLIENT_SECRET: z.string(),
  // GOOGLE_CALLBACK_URL: z.string().url(),

  // // OAuth - LinkedIn
  // LINKEDIN_CLIENT_ID: z.string(),
  // LINKEDIN_CLIENT_SECRET: z.string(),
  // LINKEDIN_CALLBACK_URL: z.string().url(),

  // // OAuth - Twitter
  // TWITTER_CLIENT_ID: z.string(),
  // TWITTER_CLIENT_SECRET: z.string(),
  // TWITTER_CALLBACK_URL: z.string().url(),

  // // File Storage
  // CLOUDINARY_CLOUD_NAME: z.string(),
  // CLOUDINARY_API_KEY: z.string(),
  // CLOUDINARY_API_SECRET: z.string(),

  // // Redis (for caching)
  // REDIS_URL: z.string().optional(),
  // REDIS_PASSWORD: z.string().optional(),

  // // Email Service
  // SMTP_HOST: z.string(),
  // SMTP_PORT: z.coerce.number(),
  // SMTP_USER: z.string(),
  // SMTP_PASSWORD: z.string(),
  // SMTP_FROM_EMAIL: z.string().email(),
  // SMTP_FROM_NAME: z.string(),

  // // Rate Limiting
  // RATE_LIMIT_WINDOW: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
  // RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  // // Security
  // CORS_ORIGIN: z.string().default('*'),
  // SECURE_COOKIE: z.coerce.boolean().default(false),
  // PASSWORD_SALT_ROUNDS: z.coerce.number().default(10),

  // // Monitoring
  // SENTRY_DSN: z.string().url().optional(),
  // LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // // Feature Flags
  // ENABLE_FILE_UPLOAD: z.coerce.boolean().default(true),
  // ENABLE_SOCIAL_LOGIN: z.coerce.boolean().default(true),
  // ENABLE_EMAIL_VERIFICATION: z.coerce.boolean().default(true),
});

// Type export for TypeScript type inference
export type EnvSchema = z.infer<typeof EnvSchema>;

/**
 * Load and expand environment variables from .env file
 */
expand(config());

/**
 * Validate environment variables against schema
 */
// try {
//   EnvSchema.parse(process.env);
// } catch (error) {
//   if (error instanceof ZodError) {
//     let message = 'Missing or invalid environment variables:\n';
//     error.issues.forEach((issue) => {
//       message += `${issue.path.join('.')}: ${issue.message}\n`;
//     });
//     const e = new Error(message);
//     e.stack = '';
//     throw e;
//   } else {
//     console.error('Error validating environment variables:', error);
//     throw error;
//   }
// }

/**
 * Export validated environment variables
 */
export default EnvSchema.parse(process.env);
