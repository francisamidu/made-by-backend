import { creators, projects } from '@/db/schema';
import { eq, desc, sql, ilike, SQL } from 'drizzle-orm';
import {
  TCreator,
  TProject,
  TPaginatedResponse,
  TSearchParams,
  TProjectResponse,
} from '@/types/schema';
import { db } from '@/db';
import { sanitizeCreator } from '@/utils/sanitizeCreator';

/**
 * Service class for handling search-related operations
 */
export class SearchService {
  /**
   * Performs a global search across creators and projects
   * @param query - Search query string
   * @param page - Page number
   * @param limit - Items per page
   */
  static async searchAll(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    creators: TPaginatedResponse<TCreator | Partial<TCreator>>;
    projects: TPaginatedResponse<TProjectResponse>;
  }> {
    const [creators, projects] = await Promise.all([
      SearchService.searchCreators(query, page, limit),
      SearchService.searchProjects(query, page, limit),
    ]);

    return { creators, projects };
  }

  /**
   * Searches creators based on various criteria
   * @param params - Search parameters
   */
  static async searchCreators(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TCreator | Partial<TCreator>>> {
    const offset = (page - 1) * limit;

    // Build search conditions
    const searchCondition = sql`(
      ${ilike(creators.name, `%${query}%`)} OR
      ${ilike(creators.username!, `%${query}%`)} OR
      ${ilike(creators.location!, `%${query}%`)} OR
      ${creators.professionalInfo}->>'title' ILIKE ${`%${query}%`} OR
      ${creators.professionalInfo}->>'skills' ILIKE ${`%${query}%`}
    )`;

    const creatorsList = (await db
      .select()
      .from(creators)
      .where(searchCondition)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(creators.createdAt))
      .execute()) as TCreator[];

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(creators)
      .where(searchCondition)
      .execute();

    const totalCount = Number(count);

    return {
      data: creatorsList.map((creator) => sanitizeCreator(creator)),
      total: totalCount,
      page,
      limit,
      hasMore: offset + limit < totalCount,
    };
  }

  /**
   * Searches projects based on various criteria
   * @param params - Search parameters
   */
  static async searchProjects(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TProjectResponse>> {
    const offset = (page - 1) * limit;

    // Build search conditions
    const searchCondition = sql`(
      ${ilike(projects.title, `%${query}%`)} OR
      ${ilike(projects.description, `%${query}%`)} OR
      ${projects.tags}::text ILIKE ${`%${query}%`}
    )`;

    const projectsList = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .where(searchCondition)
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
      .where(searchCondition)
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
   * Advanced search with multiple parameters
   * @param params - Search parameters
   */
  /**
   * Advanced search with multiple parameters
   * @param params - Search parameters
   */
  static async advancedSearch(
    params: TSearchParams,
  ): Promise<TPaginatedResponse<TProjectResponse>> {
    const {
      query,
      tags,
      location,
      isAvailableForHire,
      page = 1,
      limit = 10,
    } = params;

    const offset = (page - 1) * limit;
    const conditions: SQL<unknown>[] = [];

    // Build dynamic search conditions
    if (query) {
      conditions.push(sql`(
      ${ilike(projects.title, `%${query}%`)} OR
      ${ilike(projects.description, `%${query}%`)}
    )`);
    }

    if (tags && tags.length > 0) {
      conditions.push(
        sql`${projects.tags} && array[${sql.join(
          tags.map((tag) => sql`${tag}`),
          sql`, `,
        )}]::text[]`,
      );
    }

    if (location) {
      conditions.push(sql`${creators.location} ILIKE ${`%${location}%`}`);
    }

    if (typeof isAvailableForHire === 'boolean') {
      conditions.push(
        sql`${creators.isAvailableForHire} = ${isAvailableForHire}`,
      );
    }

    // Join all conditions with AND
    const whereClause =
      conditions.length > 0 ? sql.join(conditions, sql` AND `) : sql`TRUE`;

    const projectsList = await db
      .select({
        project: projects,
        creator: creators,
      })
      .from(projects)
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(projects.createdAt))
      .execute();

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(projects)
      .leftJoin(creators, eq(projects.creatorId, creators.id))
      .where(whereClause)
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
   * Gets popular search terms
   * @param limit - Number of terms to return
   */
  static async getPopularSearchTerms(
    limit: number = 10,
  ): Promise<Array<{ term: string; count: number }>> {
    // This would typically use a search_logs table
    // This is a placeholder implementation
    return [
      { term: 'UI Design', count: 150 },
      { term: 'Logo', count: 120 },
      { term: 'Web Development', count: 100 },
    ];
  }

  /**
   * Gets search suggestions based on partial input
   * @param partial - Partial search term
   * @param limit - Number of suggestions to return
   */
  static async getSearchSuggestions(
    partial: string,
    limit: number = 5,
  ): Promise<string[]> {
    const projectSuggestions = await db
      .select({
        title: projects.title,
      })
      .from(projects)
      .where(ilike(projects.title, `%${partial}%`))
      .limit(limit)
      .execute();

    const creatorSuggestions = await db
      .select({
        name: creators.name,
      })
      .from(creators)
      .where(ilike(creators.name, `%${partial}%`))
      .limit(limit)
      .execute();

    return [
      ...projectSuggestions.map((p) => p.title),
      ...creatorSuggestions.map((c) => c.name),
    ].slice(0, limit);
  }

  /**
   * Gets trending search terms
   * @param limit - Number of terms to return
   */
  static async getTrendingSearches(
    limit: number = 10,
  ): Promise<Array<{ term: string; trend: number }>> {
    // This would typically use a search_logs table with timestamps
    // This is a placeholder implementation
    return [
      { term: '3D Design', trend: 50 },
      { term: 'Motion Graphics', trend: 30 },
      { term: 'Branding', trend: 20 },
    ];
  }
}
