import { follows, creators } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { TFollow, TCreator, TPaginatedResponse } from '@/types/schema';
import { db } from '@/db';
import { sanitizeCreator } from '@/utils/sanitizeCreator';

/**
 * Service class for handling follow-related operations
 */
export class FollowService {
  /**
   * Creates a new follow relationship
   */
  static async create(
    followerId: string,
    followingId: string,
  ): Promise<TFollow> {
    const [result] = (await db
      .insert(follows)
      .values({
        followerId,
        followingId,
      })
      .returning()
      .execute()) as TFollow[];

    return result;
  }

  /**
   * Removes a follow relationship
   */
  static async delete(
    followerId: string,
    followingId: string,
  ): Promise<boolean> {
    const result = await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .execute();

    return result?.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Gets followers for a creator
   */
  static async getFollowers(
    creatorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TCreator | Partial<TCreator>>> {
    const offset = (page - 1) * limit;

    const followers = await db
      .select({
        follower: creators,
      })
      .from(follows)
      .where(eq(follows.followingId, creatorId))
      .leftJoin(creators, eq(follows.followerId, creators.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(follows.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(follows)
      .where(eq(follows.followingId, creatorId))
      .execute();

    const totalCount = Number(count);

    return {
      data: followers.map(({ follower }) =>
        sanitizeCreator(follower as TCreator),
      ),
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Gets creators being followed by a creator
   */
  static async getFollowing(
    creatorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TCreator | Partial<TCreator>>> {
    const offset = (page - 1) * limit;

    const following = await db
      .select({
        following: creators,
      })
      .from(follows)
      .where(eq(follows.followerId, creatorId))
      .leftJoin(creators, eq(follows.followingId, creators.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(follows.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(follows)
      .where(eq(follows.followerId, creatorId))
      .execute();

    const totalCount = Number(count);

    return {
      data: following.map(({ following }) =>
        sanitizeCreator(following as TCreator),
      ),
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Checks if a follow relationship exists
   */
  static async exists(
    followerId: string,
    followingId: string,
  ): Promise<boolean> {
    const [result] = (await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .limit(1)
      .execute()) as TFollow[];

    return !!result;
  }

  /**
   * Gets follow counts for a creator
   */
  static async getCounts(
    creatorId: string,
  ): Promise<{ followers: number; following: number }> {
    const [followerCount, followingCount] = await Promise.all([
      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(follows)
        .where(eq(follows.followingId, creatorId))
        .execute(),
      db
        .select({
          count: sql<number>`count(*)`,
        })
        .from(follows)
        .where(eq(follows.followerId, creatorId))
        .execute(),
    ]);

    return {
      followers: Number(followerCount[0].count),
      following: Number(followingCount[0].count),
    };
  }
}
