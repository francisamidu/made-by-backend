import { creators, projects, comments, follows } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  TCreatorAnalytics,
  TProjectAnalytics,
  TPaginatedResponse,
  TCreator,
  TProject,
  TableSchema,
} from '@/types/schema';

/**
 * Handler class for managing analytics-related operations
 */
export class AnalyticsHandler {
  /**
   * Get analytics for a specific creator
   */
  async getCreatorAnalytics(creatorId: string): Promise<TCreatorAnalytics> {
    // Get creator's projects with engagement data
    const creatorProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        views: projects.views,
        likes: projects.likes,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .where(eq(projects.creatorId, creatorId));

    // Get follower growth over time
    const followerGrowth = await db
      .select({
        createdAt: follows.createdAt,
        followers: sql<number>`count(*)`,
      })
      .from(follows)
      .where(eq(follows.followingId, creatorId))
      .groupBy(follows.createdAt)
      .orderBy(follows.createdAt);

    const projectEngagement = creatorProjects.map((project) => ({
      projectId: project.id,
      title: project.title,
      views: project.views,
      likes: project.likes,
    }));

    return {
      totalProjectViews: creatorProjects.reduce((sum, p) => sum + p.views, 0),
      totalAppreciations: creatorProjects.reduce((sum, p) => sum + p.likes, 0),
      followerGrowth: followerGrowth.map((fg) => ({
        date: fg.createdAt,
        followers: Number(fg.followers),
      })),
      projectEngagement,
    };
  }

  /**
   * Get analytics for a specific project
   */
  async getProjectAnalytics(projectId: string): Promise<TProjectAnalytics> {
    // Get project data
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    // Get comment count
    const commentCount = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(comments)
      .where(eq(comments.projectId, projectId));

    // Get views over time
    const viewsOverTime = await db
      .select({
        date: sql<Date>`date_trunc('day', ${projects.createdAt})`,
        views: projects.views,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .orderBy(sql`date_trunc('day', ${projects.createdAt})`);

    return {
      totalViews: project[0].views,
      totalLikes: project[0].likes,
      commentCount: Number(commentCount[0].count),
      viewsOverTime: viewsOverTime.map((vot) => ({
        date: vot.date,
        views: vot.views,
      })),
    };
  }

  /**
   * Get trending creators based on engagement metrics
   */
  async getTrendingCreators(
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TCreator>> {
    const offset = (page - 1) * limit;

    const trendingCreators = await db
      .select()
      .from(creators)
      .orderBy(sql`(${creators.stats}->>'projectViews')::int DESC`)
      .limit(limit)
      .offset(offset);

    const total = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(creators);

    return {
      data: trendingCreators as TCreator[],
      total: Number(total[0].count),
      page,
      limit,
      hasMore: offset + limit < Number(total[0].count),
    };
  }

  /**
   * Get trending projects based on engagement
   */
  async getTrendingProjects(
    page: number = 1,
    limit: number = 10,
  ): Promise<TPaginatedResponse<TProject>> {
    const offset = (page - 1) * limit;

    const trendingProjects = await db
      .select()
      .from(projects)
      .orderBy(sql`${projects.views} + ${projects.likes} DESC`)
      .limit(limit)
      .offset(offset);

    const total = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(projects);

    return {
      data: trendingProjects as TProject[],
      total: Number(total[0].count),
      page,
      limit,
      hasMore: offset + limit < Number(total[0].count),
    };
  }

  /**
   * Get platform-wide engagement metrics
   */
  async getPlatformMetrics() {
    const [projectMetrics, creatorMetrics, followMetrics] = await Promise.all([
      db
        .select({
          totalViews: sql<number>`sum(${projects.views})`,
          totalLikes: sql<number>`sum(${projects.likes})`,
          totalProjects: sql<number>`count(*)`,
        })
        .from(projects),

      db
        .select({
          totalCreators: sql<number>`count(*)`,
        })
        .from(creators),

      db
        .select({
          totalFollows: sql<number>`count(*)`,
        })
        .from(follows),
    ]);

    return {
      engagement: {
        totalViews: Number(projectMetrics[0].totalViews),
        totalLikes: Number(projectMetrics[0].totalLikes),
        totalFollows: Number(followMetrics[0].totalFollows),
      },
      platform: {
        totalCreators: Number(creatorMetrics[0].totalCreators),
        totalProjects: Number(projectMetrics[0].totalProjects),
      },
    };
  }

  /**
   * Get engagement metrics for a specific time period
   */
  async getTimeBasedMetrics(startDate: Date, endDate: Date) {
    const metrics = await db
      .select({
        date: sql<Date>`date_trunc('day', ${projects.createdAt})`,
        views: sql<number>`sum(${projects.views})`,
        likes: sql<number>`sum(${projects.likes})`,
      })
      .from(projects)
      .where(sql`${projects.createdAt} BETWEEN ${startDate} AND ${endDate}`)
      .groupBy(sql`date_trunc('day', ${projects.createdAt})`)
      .orderBy(sql`date_trunc('day', ${projects.createdAt})`);

    return metrics.map((m) => ({
      date: m.date,
      views: Number(m.views),
      likes: Number(m.likes),
    }));
  }
}
