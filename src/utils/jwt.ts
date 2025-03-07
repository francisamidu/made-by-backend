import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '@/env';
import { JWTPayload } from '@/types/jwt';

const JWT_SECRET = env.JWT_SECRET;

/**
 * Generates a JWT token
 * @param payload - Data to be encoded in the token
 * @param expiresIn - Token expiration time
 * @returns Signed JWT token
 */
export const generateJWT = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export const verifyJWT = async (token: string): Promise<JWTPayload> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return {
      id: undefined,
    };
  }
};
