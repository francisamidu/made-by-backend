import { creators, projects, follows } from '@/db/schema';
import { eq, and, or, ilike, desc, sql } from 'drizzle-orm';
import {
  TableSchema,
  TCreator,
  TProfessionalInfo,
  TCreatorStats,
} from '@/types/schema';
import { db } from '@/db';
import { sanitizeCreator } from '@/utils/sanitizeCreator';

/**
 * Service class for managing creator-related database operations
 */
export class CreatorService {
  /**
   * Retrieves all creators from the database
   * @returns Promise containing an array of creators or null if none found
   */
  static async findAll(): Promise<
    TCreator[] | Partial<TCreator>[] | TableSchema['creators'] | null
  > {
    const result = await db.select().from(creators);
    return result.map((creator) => sanitizeCreator(creator as TCreator));
  }

  /**
   * Finds a creator by their ID
   * @param id - The unique identifier of the creator
   * @returns Promise containing the creator or null if not found
   */
  static async findById(
    id: string,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = await db
      .select()
      .from(creators)
      .where(eq(creators.id, id))
      .limit(1);
    return result[0] ? sanitizeCreator(result[0] as TCreator) : null;
  }

  /**
   * Finds a creator by their username
   * @param username - The username to search for
   * @returns Promise containing the creator or null if not found
   */
  static async findByUsername(
    username: string,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = await db
      .select()
      .from(creators)
      .where(eq(creators.username, username))
      .limit(1);
    return result[0] ? sanitizeCreator(result[0] as TCreator) : null;
  }

  /**
   * Creates a new creator
   * @param data - Creator data excluding auto-generated fields
   * @returns Promise containing the newly created creator
   */
  static async create(
    data: Omit<TCreator, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = await db
      .insert(creators)
      .values({
        ...data,
        stats: {
          projectViews: 0,
          appreciations: 0,
          followers: 0,
          following: 0,
        },
      })
      .returning();
    return sanitizeCreator(result[0] as TCreator);
  }

  /**
   * Updates an existing creator
   * @param id - The ID of the creator to update
   * @param data - Partial creator data to update
   * @returns Promise containing the updated creator or null if not found
   */
  static async update(
    id: string,
    data: Partial<Omit<TCreator, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const result = await db
      .update(creators)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(creators.id, id))
      .returning();
    return result[0] ? sanitizeCreator(result[0] as TCreator) : null;
  }

  /**
   * Updates a creator's professional info
   * @param id - The ID of the creator
   * @param info - Professional info to update
   * @returns Promise containing the updated creator or null if not found
   */
  static async updateProfessionalInfo(
    id: string,
    info: Partial<TProfessionalInfo>,
  ): Promise<TCreator | Partial<TCreator | null>> {
    const creator = await CreatorService.findById(id);
    if (!creator) return null;

    const result = await db
      .update(creators)
      .set({
        professionalInfo: { ...creator.professionalInfo, ...info },
        updatedAt: new Date(),
      })
      .where(eq(creators.id, id))
      .returning();
    return result[0] ? sanitizeCreator(result[0] as TCreator) : null;
  }

  /**
   * Updates a creator's stats
   * @param id - The ID of the creator
   * @param stats - Stats to update
   * @returns Promise containing the updated creator or null if not found
   */
  static async updateStats(
    id: string,
    stats: Partial<TCreatorStats>,
  ): Promise<TCreator | Partial<TCreator> | null> {
    const creator = await CreatorService.findById(id);
    if (!creator) return null;

    const result = await db
      .update(creators)
      .set({
        stats: { ...creator.stats, ...stats },
        updatedAt: new Date(),
      })
      .where(eq(creators.id, id))
      .returning();
    return result[0] ? sanitizeCreator(result[0] as TCreator) : null;
  }

  /**
   * Deletes a creator by their ID
   * @param id - The ID of the creator to delete
   * @returns Promise containing boolean indicating success of deletion
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db.delete(creators).where(eq(creators.id, id));
    return result?.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Finds creators by location
   * @param location - The location to search for
   * @returns Promise containing an array of creators
   */
  static async findByLocation(
    location: string,
  ): Promise<TCreator[] | Partial<TCreator>[]> {
    const result = await db
      .select()
      .from(creators)
      .where(ilike(creators.location!, `%${location}%`));
    return result.map((creator) => sanitizeCreator(creator as TCreator));
  }

  /**
   * Finds available creators
   * @returns Promise containing an array of available creators
   */
  static async findAvailable(): Promise<TCreator[] | Partial<TCreator>[]> {
    const result = await db
      .select()
      .from(creators)
      .where(eq(creators.isAvailableForHire, true));
    return result.map((creator) => sanitizeCreator(creator as TCreator));
  }

  /**
   * Gets creator followers
   * @param id - The ID of the creator
   * @returns Promise containing an array of followers
   */
  static async getFollowers(
    id: string,
  ): Promise<TCreator[] | Partial<TCreator>[]> {
    const result = await db
      .select({
        follower: creators,
      })
      .from(follows)
      .where(eq(follows.followingId, id))
      .leftJoin(creators, eq(follows.followerId, creators.id));
    return result.map(({ follower }) => sanitizeCreator(follower as TCreator));
  }

  /**
   * Gets creators being followed
   * @param id - The ID of the creator
   * @returns Promise containing an array of followed creators
   */
  static async getFollowing(
    id: string,
  ): Promise<TCreator[] | Partial<TCreator>[]> {
    const result = await db
      .select({
        following: creators,
      })
      .from(follows)
      .where(eq(follows.followerId, id))
      .leftJoin(creators, eq(follows.followingId, creators.id));
    return result.map(({ following }) =>
      sanitizeCreator(following as TCreator),
    );
  }

  /**
   * Checks if one creator is following another
   * @param followerId - The ID of the follower
   * @param followingId - The ID of the creator being followed
   * @returns Promise containing boolean indicating follow status
   */
  static async isFollowing(
    followerId: string,
    followingId: string,
  ): Promise<boolean> {
    const result = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .limit(1);
    return !!result[0];
  }
}
