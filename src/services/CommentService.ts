import { comments, creators, projects } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { TComment, TCreator, TPaginatedResponse } from '@/types/schema';
import { db } from '@/db';
import { sanitizeCreator } from '@/utils/sanitizeCreator';

/**
 * Service class for handling comment-related operations
 */
export class CommentService {
  /**
   * Creates a new comment
   */
  static async create(
    creatorId: string,
    projectId: string,
    content: string,
  ): Promise<TComment> {
    const [result] = (await db
      .insert(comments)
      .values({
        creatorId,
        projectId,
        content,
      })
      .returning()
      .execute()) as TComment[];

    return result;
  }

  /**
   * Gets a comment by ID
   */
  static async findById(id: string): Promise<TComment | null> {
    const [result] = await db
      .select({
        comment: comments,
        creator: creators,
      })
      .from(comments)
      .where(eq(comments.id, id))
      .leftJoin(creators, eq(comments.creatorId, creators.id))
      .limit(1)
      .execute();

    if (!result) return null;

    return {
      ...result.comment,
      creator: sanitizeCreator(result.creator as TCreator),
    } as TComment;
  }

  /**
   * Updates a comment
   */
  static async update(id: string, content: string): Promise<TComment | null> {
    const [result] = (await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, id))
      .returning()
      .execute()) as TComment[];

    return result || null;
  }

  /**
   * Deletes a comment
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .execute();

    return result?.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Gets comments for a project
   */
  static async getProjectComments(
    projectId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TComment>> {
    const offset = (page - 1) * limit;

    const commentsList = await db
      .select({
        comment: comments,
        creator: creators,
      })
      .from(comments)
      .where(eq(comments.projectId, projectId))
      .leftJoin(creators, eq(comments.creatorId, creators.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(comments.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(comments)
      .where(eq(comments.projectId, projectId))
      .execute();

    const totalCount = Number(count);

    return {
      data: commentsList.map(({ comment, creator }) => ({
        ...comment,
        creator: sanitizeCreator(creator as TCreator),
      })) as TComment[],
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Gets comments by a creator
   */
  static async getCreatorComments(
    creatorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TComment>> {
    const offset = (page - 1) * limit;

    const commentsList = await db
      .select({
        comment: comments,
        project: projects,
      })
      .from(comments)
      .where(eq(comments.creatorId, creatorId))
      .leftJoin(projects, eq(comments.projectId, projects.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(comments.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(comments)
      .where(eq(comments.creatorId, creatorId))
      .execute();

    const totalCount = Number(count);

    return {
      data: commentsList.map(({ comment, project }) => ({
        ...comment,
        project,
      })) as TComment[],
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Checks if a creator can modify a comment
   */
  static async canModify(
    commentId: string,
    creatorId: string,
  ): Promise<boolean> {
    const [result] = (await db
      .select()
      .from(comments)
      .where(and(eq(comments.id, commentId), eq(comments.creatorId, creatorId)))
      .limit(1)
      .execute()) as TComment[];

    return !!result;
  }

  /**
   * Gets comment count for a project
   */
  static async getCount(projectId: string): Promise<number> {
    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(comments)
      .where(eq(comments.projectId, projectId))
      .execute();

    return Number(count);
  }

  /**
   * Gets recent comments
   */
  static async getRecent(limit: number = 10): Promise<TComment[]> {
    const recentComments = await db
      .select({
        comment: comments,
        creator: creators,
        project: projects,
      })
      .from(comments)
      .leftJoin(creators, eq(comments.creatorId, creators.id))
      .leftJoin(projects, eq(comments.projectId, projects.id))
      .limit(limit)
      .orderBy(desc(comments.createdAt))
      .execute();

    return recentComments.map(({ comment, creator, project }) => ({
      ...comment,
      creator: sanitizeCreator(creator as TCreator),
      project,
    })) as TComment[];
  }
}
