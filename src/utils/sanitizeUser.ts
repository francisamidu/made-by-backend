import { TUser } from '@/types/schema';
/**
 * Sanitizes a user object by removing sensitive information
 *
 * @param user - The user object to sanitize, can be partial or null
 * @returns A new user object with sensitive fields removed, or null if input was null
 *
 * This utility function helps prevent sensitive user data like passwords
 * and reset tokens from being accidentally exposed in API responses or logs.
 * It creates a new object copying all fields except the sensitive ones.
 */

export function sanitizeUser(user: TUser | null): Partial<TUser> | null {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user; // Exclude sensitive fields
  return safeUser;
}
