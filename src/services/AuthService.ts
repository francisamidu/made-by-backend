import { creators } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  TCreator,
  TSocialLinks,
  TProfessionalInfo,
  TCreatorStats,
} from '@/types/schema';
import { generateJWT, verifyJWT } from '@/utils/jwt';
import { hashPassword, comparePassword } from '@/utils/password';
import { sanitizeCreator } from '@/utils/sanitizeCreator';

/**
 * Service class for handling authentication-related operations
 */
export class AuthService {
  /**
   * Authenticates a creator using OAuth profile
   * @param profile - OAuth provider profile
   * @returns Authenticated creator object or null
   */
  static async authenticateWithOAuth(
    profile: any,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = (await db
      .select()
      .from(creators)
      .where(
        sql`${creators.socialLinks}->>'${profile.provider}' = ${profile.id}`,
      )
      .limit(1)) as TCreator[];

    if (result[0] != null) {
      return sanitizeCreator(result[0]);
    }

    // Create new creator if not exists
    return await AuthService.createCreatorFromOAuth(profile);
  }

  /**
   * Creates a new creator from OAuth profile
   * @param profile - OAuth provider profile
   * @returns Newly created creator object
   */
  static async createCreatorFromOAuth(
    profile: any,
  ): Promise<TCreator | Partial<TCreator>> {
    const socialLinks: TSocialLinks = {
      [profile.provider]: profile.id,
    };

    const professionalInfo: TProfessionalInfo = {
      title: '',
      skills: [],
      tools: [],
      collaborators: [],
    };

    const stats: TCreatorStats = {
      projectViews: 0,
      appreciations: 0,
      followers: 0,
      following: 0,
    };

    const result = (await db
      .insert(creators)
      .values({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        socialLinks,
        professionalInfo,
        stats,
        isAvailableForHire: false,
      })
      .returning()) as TCreator[];

    return sanitizeCreator(result[0]);
  }

  /**
   * Finds a creator by their email address
   * @param email - The email address to search for
   * @returns Creator object or null if not found
   */
  static async findByEmail(
    email: string,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = (await db
      .select()
      .from(creators)
      .where(eq(creators.email, email))
      .limit(1)) as TCreator[];

    return result[0] ? sanitizeCreator(result[0]) : null;
  }

  /**
   * Finds a creator by their social provider ID
   * @param provider - OAuth provider name
   * @param socialId - Provider-specific ID
   * @returns Creator object or null if not found
   */
  static async findBySocialId(
    provider: string,
    socialId: string,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = (await db
      .select()
      .from(creators)
      .where(sql`${creators.socialLinks}->>'${provider}' = ${socialId}`)
      .limit(1)) as TCreator[];

    return result[0] ? sanitizeCreator(result[0]) : null;
  }

  /**
   * Generates authentication tokens for a creator
   * @param creator - Creator object
   * @returns Access and refresh tokens
   */
  static async generateAuthTokens(creator: TCreator) {
    const accessToken = generateJWT({ id: creator.id, email: creator.email });

    const refreshToken = generateJWT({ id: creator.id });

    return { accessToken, refreshToken };
  }

  /**
   * Refreshes access token using refresh token
   * @param refreshToken - Valid refresh token
   * @returns New access and refresh tokens
   */
  static async refreshToken(refreshToken: string) {
    const decoded = await verifyJWT(refreshToken);

    const result = (await db
      .select()
      .from(creators)
      .where(eq(creators.id, decoded.id))
      .limit(1)) as TCreator[];

    if (!result[0]) {
      return null;
    }

    return AuthService.generateAuthTokens(
      sanitizeCreator(result[0]) as TCreator,
    );
  }

  /**
   * Updates a creator's social links
   * @param id - Creator's unique identifier
   * @param socialLinks - Updated social links
   * @returns Updated creator object or null
   */
  static async updateSocialLinks(
    id: string,
    socialLinks: Partial<TSocialLinks>,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = (await db
      .update(creators)
      .set({
        socialLinks: sql`${creators.socialLinks} || ${JSON.stringify(socialLinks)}::jsonb`,
        updatedAt: new Date(),
      })
      .where(eq(creators.id, id))
      .returning()) as TCreator[];

    return result[0] ? sanitizeCreator(result[0]) : null;
  }

  /**
   * Validates creator's session
   * @param accessToken - Valid access token
   * @returns Creator object or null if session invalid
   */
  static async validateSession(
    accessToken: string,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const decoded = await verifyJWT(accessToken);

    const result = (await db
      .select()
      .from(creators)
      .where(eq(creators.id, decoded.id))
      .limit(1)) as TCreator[];

    return result[0] ? sanitizeCreator(result[0]) : null;
  }

  /**
   * Revokes a creator's refresh token
   * @param creatorId - Creator's unique identifier
   * @returns Boolean indicating success
   */
  static async revokeRefreshToken(creatorId: string): Promise<boolean> {
    // Implementation would depend on your token storage strategy
    // This is a placeholder for the concept
    return true;
  }

  /**
   * Logs out a creator by revoking their tokens
   * @param creatorId - Creator's unique identifier
   * @returns Boolean indicating success
   */
  static async logout(creatorId: string): Promise<boolean> {
    return await AuthService.revokeRefreshToken(creatorId);
  }
}
