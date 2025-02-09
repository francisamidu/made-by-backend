import { searchLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TableSchema, TSearchLog } from '@/types/schema';
import { db } from '@/db';

/**
 * Service class for managing search log-related database operations
 */
export class SearchLogService {
  /**
   * Finds search logs for a specific user
   * @param userId - The ID of the user to find search logs for
   * @returns Promise containing the search log or null if not found
   */
  static async findByUser(userId: number): Promise<TSearchLog | null> {
    const result = await db
      .select()
      .from(searchLogs)
      .where(eq(searchLogs.userId, userId))
      .limit(1);
    return (result[0] as TSearchLog) || null;
  }

  /**
   * Retrieves all search logs from the database
   * @returns Promise containing an array of search logs or null if none found
   */
  static async findAll(): Promise<
    TSearchLog[] | TableSchema['searchLogs'] | null
  > {
    const result = await db.select().from(searchLogs);
    return result as TSearchLog[];
  }
}
