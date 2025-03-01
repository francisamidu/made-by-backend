// import { comments, creators, projects } from '@/db/schema';
// import { eq, and, desc, sql } from 'drizzle-orm';
// import { db } from '@/db';
// import { TComment, TCreator, TPaginatedResponse } from '@/types/schema';

// /**
//  * Service class for handling comment-related operations
//  */
// export class CommentService {
//   /**
//    * Creates a new comment
//    * @param creatorId - ID of the creator making the comment
//    * @param projectId - ID of the project being commented on
//    * @param content - Comment content
//    */
//   static async create(
//     creatorId: string,
//     projectId: string,
//     content: string,
//   ): Promise<TComment> {
//     const [comment] = (await db
//       .insert(comments)
//       .values({
//         creatorId,
//         projectId,
//         content,
//       })
//       .returning()
//       .execute()) as TComment[];

//     return comment;
//   }

//   /**
//    * Retrieves a comment by its ID
//    * @param commentId - ID of the comment to retrieve
//    */
//   static async findById(commentId: string): Promise<TComment | null> {
//     const [comment] = (await db
//       .select()
//       .from(comments)
//       .where(eq(comments.id, commentId))
//       .limit(1)
//       .execute()) as TComment[];

//     return comment || null;
//   }

//   /**
//    * Updates a comment
//    * @param commentId - ID of the comment to update
//    * @param content - New comment content
//    */
//   static async update(
//     commentId: string,
//     content: string,
//   ): Promise<TComment | null> {
//     const [updated] = (await db
//       .update(comments)
//       .set({
//         content,
//         updatedAt: new Date(),
//       })
//       .where(eq(comments.id, commentId))
//       .returning()
//       .execute()) as TComment[];

//     return updated || null;
//   }

//   /**
//    * Deletes a comment
//    * @param commentId - ID of the comment to delete
//    */
//   static async delete(commentId: string): Promise<boolean> {
//     const result = await db
//       .delete(comments)
//       .where(eq(comments.id, commentId))
//       .execute();

//     return result.rowCount ? result.rowCount > 0 : false;
//   }

//   /**
//    * Gets all comments for a project with pagination
//    * @param projectId - ID of the project
//    * @param page - Page number
//    * @param limit - Number of comments per page
//    */
//   static async getProjectComments(
//     projectId: string,
//     page: number = 1,
//     limit: number = 10,
//   ): Promise<TPaginatedResponse<TComment>> {
//     const offset = (page - 1) * limit;

//     const comments = await db
//       .select({
//         comment: comments,
//         creator: creators,
//       })
//       .from(comments)
//       .where(eq(comments.projectId, projectId))
//       .leftJoin(creators, eq(comments.creatorId, creators.id))
//       .orderBy(desc(comments.createdAt))
//       .limit(limit)
//       .offset(offset)
//       .execute();

//     const [{ count }] = await db
//       .select({
//         count: sql<number>`count(*)`,
//       })
//       .from(comments)
//       .where(eq(comments.projectId, projectId))
//       .execute();

//     const totalCount = Number(count);

//     return {
//       data: comments.map(({ comment, creator }) => ({
//         ...comment,
//         creator: creator as TCreator,
//       })) as TComment[],
//       total: totalCount,
//       page,
//       limit,
//       hasMore: offset + limit < totalCount,
//     };
//   }

//   /**
//    * Gets all comments by a creator with pagination
//    * @param creatorId - ID of the creator
//    * @param page - Page number
//    * @param limit - Number of comments per page
//    */
//   static async getCreatorComments(
//     creatorId: string,
//     page: number = 1,
//     limit: number = 10,
//   ): Promise<TPaginatedResponse<TComment>> {
//     const offset = (page - 1) * limit;

//     const comments = await db
//       .select({
//         comment: comments,
//         project: projects,
//       })
//       .from(comments)
//       .where(eq(comments.creatorId, creatorId))
//       .leftJoin(projects, eq(comments.projectId, projects.id))
//       .orderBy(desc(comments.createdAt))
//       .limit(limit)
//       .offset(offset)
//       .execute();

//     const [{ count }] = await db
//       .select({
//         count: sql<number>`count(*)`,
//       })
//       .from(comments)
//       .where(eq(comments.creatorId, creatorId))
//       .execute();

//     const totalCount = Number(count);

//     return {
//       data: comments.map(({ comment, project }) => ({
//         ...comment,
//         project,
//       })) as TComment[],
//       total: totalCount,
//       page,
//       limit,
//       hasMore: offset + limit < totalCount,
//     };
//   }

//   /**
//    * Checks if a creator can modify a comment
//    * @param commentId - ID of the comment
//    * @param creatorId - ID of the creator
//    */
//   static async canModifyComment(
//     commentId: string,
//     creatorId: string,
//   ): Promise<boolean> {
//     const [comment] = await db
//       .select()
//       .from(comments)
//       .where(and(eq(comments.id, commentId), eq(comments.creatorId, creatorId)))
//       .limit(1)
//       .execute();

//     return !!comment;
//   }

//   /**
//    * Gets comment count for a project
//    * @param projectId - ID of the project
//    */
//   static async getCommentCount(projectId: string): Promise<number> {
//     const [{ count }] = await db
//       .select({
//         count: sql<number>`count(*)`,
//       })
//       .from(comments)
//       .where(eq(comments.projectId, projectId))
//       .execute();

//     return Number(count);
//   }

//   /**
//    * Gets recent comments with pagination
//    * @param page - Page number
//    * @param limit - Number of comments per page
//    */
//   static async getRecentComments(
//     page: number = 1,
//     limit: number = 10,
//   ): Promise<TPaginatedResponse<TComment>> {
//     const offset = (page - 1) * limit;

//     const comments = await db
//       .select({
//         comment: comments,
//         creator: creators,
//         project: projects,
//       })
//       .from(comments)
//       .leftJoin(creators, eq(comments.creatorId, creators.id))
//       .leftJoin(projects, eq(comments.projectId, projects.id))
//       .orderBy(desc(comments.createdAt))
//       .limit(limit)
//       .offset(offset)
//       .execute();

//     const [{ count }] = await db
//       .select({
//         count: sql<number>`count(*)`,
//       })
//       .from(comments)
//       .execute();

//     const totalCount = Number(count);

//     return {
//       data: comments.map(({ comment, creator, project }) => ({
//         ...comment,
//         creator: creator as TCreator,
//         project,
//       })) as TComment[],
//       total: totalCount,
//       page,
//       limit,
//       hasMore: offset + limit < totalCount,
//     };
//   }

//   /**
//    * Searches comments by content
//    * @param query - Search query
//    * @param page - Page number
//    * @param limit - Number of comments per page
//    */
//   static async searchComments(
//     query: string,
//     page: number = 1,
//     limit: number = 10,
//   ): Promise<TPaginatedResponse<TComment>> {
//     const offset = (page - 1) * limit;

//     const comments = await db
//       .select({
//         comment: comments,
//         creator: creators,
//         project: projects,
//       })
//       .from(comments)
//       .where(sql`${comments.content} ILIKE ${`%${query}%`}`)
//       .leftJoin(creators, eq(comments.creatorId, creators.id))
//       .leftJoin(projects, eq(comments.projectId, projects.id))
//       .orderBy(desc(comments.createdAt))
//       .limit(limit)
//       .offset(offset)
//       .execute();

//     const [{ count }] = await db
//       .select({
//         count: sql<number>`count(*)`,
//       })
//       .from(comments)
//       .where(sql`${comments.content} ILIKE ${`%${query}%`}`)
//       .execute();

//     const totalCount = Number(count);

//     return {
//       data: comments.map(({ comment, creator, project }) => ({
//         ...comment,
//         creator: creator as TCreator,
//         project,
//       })) as TComment[],
//       total: totalCount,
//       page,
//       limit,
//       hasMore: offset + limit < totalCount,
//     };
//   }
// }
