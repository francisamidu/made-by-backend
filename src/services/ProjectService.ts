import { projects, creators, comments } from '@/db/schema';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import {
  TProject,
  TProjectResponse,
  TPaginatedResponse,
  TCreateProjectRequest,
  TProjectSort,
  TCreator,
} from '@/types/schema';
import { db } from '@/db';

/**
 * Service class for managing project-related database operations
 */
export class ProjectService {
  /**
   * Retrieves all projects with pagination
   */
  static async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TProjectResponse>> {
    const offset = (page - 1) * limit;

    const projectsList = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(projects.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(projects)
      .execute();

    const totalCount = Number(count);

    return {
      data: projectsList.map(({ project, creator }) => ({
        ...(project as TProject),
        creator: creator as TCreator,
      })) as TProjectResponse[],
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Finds a project by its ID
   */
  static async findById(id: string): Promise<TProjectResponse | null> {
    const [result] = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .where(eq(projects.id, id))
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .limit(1)
      .execute();

    if (!result) return null;

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(comments)
      .where(eq(comments.projectId, id))
      .execute();

    return {
      ...(result.project as TProject),
      creator: result.creator as TCreator,
      commentCount: Number(count),
    } as TProjectResponse;
  }

  /**
   * Creates a new project
   */
  static async create(
    creatorId: string,
    data: TCreateProjectRequest,
  ): Promise<TProject> {
    const [result] = (await db
      .insert(projects)
      .values({
        ...data,
        creatorId,
        likes: 0,
        views: 0,
      })
      .returning()
      .execute()) as TProject[];

    return result;
  }

  /**
   * Updates an existing project
   */
  static async update(
    id: string,
    data: Partial<TCreateProjectRequest>,
  ): Promise<TProject | null> {
    const [result] = (await db
      .update(projects)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning()
      .execute()) as TProject[];

    return result || null;
  }

  /**
   * Deletes a project
   */
  static async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .execute();

    return result?.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Increments project view count
   */
  static async incrementViews(id: string): Promise<number> {
    const [result] = (await db
      .update(projects)
      .set({
        views: sql`${projects.views} + 1`,
      })
      .where(eq(projects.id, id))
      .returning()
      .execute()) as TProject[];

    return result?.views || 0;
  }

  /**
   * Toggles like status for a project
   */
  static async toggleLike(
    id: string,
    increment: boolean = true,
  ): Promise<number> {
    const [result] = (await db
      .update(projects)
      .set({
        likes: sql`${projects.likes} ${increment ? '+' : '-'} 1`,
      })
      .where(eq(projects.id, id))
      .returning()
      .execute()) as TProject[];

    return result?.likes || 0;
  }

  /**
   * Searches projects
   */
  static async search(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TProjectResponse>> {
    const offset = (page - 1) * limit;

    const searchResults = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .where(
        or(
          ilike(projects.title, `%${query}%`),
          ilike(projects.description, `%${query}%`),
          sql`${projects.tags}::text ILIKE ${`%${query}%`}`,
        ),
      )
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(projects.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(projects)
      .where(
        or(
          ilike(projects.title, `%${query}%`),
          ilike(projects.description, `%${query}%`),
          sql`${projects.tags}::text ILIKE ${`%${query}%`}`,
        ),
      )
      .execute();

    const totalCount = Number(count);

    return {
      data: searchResults.map(({ project, creator }) => ({
        ...(project as TProject),
        creator: creator as TCreator,
      })) as TProjectResponse[],
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Gets projects by tags
   */
  /**
   * Gets projects by tags
   */
  static async getByTags(
    tags: string[],
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TProjectResponse>> {
    const offset = (page - 1) * limit;

    // Create a SQL condition for array overlap
    const tagsCondition = sql`${projects.tags} && array[${sql.join(
      tags.map((tag) => sql`${tag}`),
      sql`, `,
    )}]::text[]`;

    const projectsList = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .where(tagsCondition)
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(projects.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(projects)
      .where(tagsCondition)
      .execute();

    const totalCount = Number(count);

    return {
      data: projectsList.map(({ project, creator }) => ({
        ...(project as TProject),
        creator: creator as TCreator,
      })) as TProjectResponse[],
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }
  /**
   * Gets projects by tags
   */
  static async getTrending(
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TProjectResponse>> {
    const offset = (page - 1) * limit;

    const trendingProjects = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .orderBy(sql`${projects.views} + ${projects.likes} DESC`)
      .limit(limit)
      .offset(offset)
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(projects)
      .execute();

    const totalCount = Number(count);

    return {
      data: trendingProjects.map(({ project, creator }) => ({
        ...(project as TProject),
        creator: creator as TCreator,
      })) as TProjectResponse[],
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Gets projects sorted by specified criteria
   */
  static async getSorted(
    sortBy: TProjectSort,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TProjectResponse>> {
    const offset = (page - 1) * limit;

    let orderByClause;
    switch (sortBy) {
      case 'latest':
        orderByClause = desc(projects.createdAt);
        break;
      case 'popular':
        orderByClause = desc(projects.likes);
        break;
      case 'trending':
        orderByClause = sql`${projects.views} + ${projects.likes} DESC`;
        break;
      default:
        orderByClause = desc(projects.createdAt);
    }

    const sortedProjects = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(projects)
      .execute();

    const totalCount = Number(count);

    return {
      data: sortedProjects.map(({ project, creator }) => ({
        ...(project as TProject),
        creator: creator as TCreator,
      })) as TProjectResponse[],
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Checks if a creator owns a project
   */
  static async isOwner(projectId: string, creatorId: string): Promise<boolean> {
    const [result] = (await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.creatorId, creatorId)))
      .limit(1)
      .execute()) as TProject[];

    return !!result;
  }
}
