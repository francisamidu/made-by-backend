import { searchLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TableSchema, TSearchLog } from '@/types/schema';
import { db } from '@/db';

export class SearchLogService {
  static async findByUser(userId: number): Promise<TSearchLog | null> {
    const result = await db
      .select()
      .from(searchLogs)
      .where(eq(searchLogs.userId, userId))
      .limit(1);
    return (result[0] as TSearchLog) || null;
  }

  static async findAll(): Promise<
    TSearchLog[] | TableSchema['searchLogs'] | null
  > {
    const result = await db.select().from(searchLogs);
    return result as TSearchLog[];
  }
}
