// @/utils/sanitizeCreator.ts
import { TCreator } from '@/types/schema';

/**
 * Removes sensitive information from creator object
 * @param creator - Creator object to sanitize
 * @returns Sanitized creator object
 */
export const sanitizeCreator = (creator: TCreator): Partial<TCreator> => {
  // Deep clone the creator object
  const sanitized = JSON.parse(JSON.stringify(creator)) as TCreator;

  // Remove sensitive fields
  const sensitiveFields = [
    'password',
    'refreshToken',
    'verificationToken',
    'resetPasswordToken',
  ];

  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      delete sanitized[field as keyof TCreator];
    }
  });

  // Ensure certain fields are properly formatted
  if (sanitized.socialLinks) {
    // Remove any private tokens or sensitive data from social links
    Object.keys(sanitized.socialLinks).forEach((provider) => {
      if (typeof sanitized.socialLinks[provider] === 'object') {
        sanitized.socialLinks[provider] = 'connected';
      }
    });
  }

  // Format dates consistently
  if (sanitized.createdAt) {
    sanitized.createdAt = new Date(sanitized.createdAt);
  }
  if (sanitized.updatedAt) {
    sanitized.updatedAt = new Date(sanitized.updatedAt);
  }

  return sanitized;
};

// Optional: Add a type guard for creator objects
export const isCreator = (obj: any): obj is TCreator => {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
};

// Optional: Add validation helper
export const validateCreatorData = (data: Partial<TCreator>): boolean => {
  const requiredFields = ['name', 'email', 'avatar'];
  return requiredFields.every(
    (field) => field in data && data[field as keyof TCreator],
  );
};

// Optional: Add error types
export class CreatorValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreatorValidationError';
  }
}

// Optional: Add constants for token configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  VERIFICATION_TOKEN_EXPIRY: '24h',
  RESET_PASSWORD_TOKEN_EXPIRY: '1h',
} as const;

// Optional: Add helper for handling OAuth profile conversion
export const normalizeOAuthProfile = (profile: any, provider: string) => {
  return {
    name: profile.displayName || `${profile.firstName} ${profile.lastName}`,
    email: profile.emails?.[0]?.value,
    avatar: profile.photos?.[0]?.value,
    socialLinks: {
      [provider]: profile.id,
    },
    professionalInfo: {
      title: profile._json?.headline || profile._json?.bio || '',
      skills: [],
      tools: [],
      collaborators: [],
    },
  };
};
