import { Request, Response } from 'express';
import { AnalyticsService } from '@/services/AnalyticsService';
import {
  TCreatorAnalytics,
  TProjectAnalytics,
  TPaginatedResponse,
  TCreator,
  TProject,
} from '@/types/schema';

/**
 * Handler for analytics-related operations
 */
export class AnalyticsHandler {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  /**
   * Get analytics for a specific creator
   * @route GET /api/analytics/creators/:id
   */
  async getCreatorAnalytics(req: Request, res: Response<TCreatorAnalytics>) {
    const creatorId = req.params.id;
    const analytics =
      await this.analyticsService.getCreatorAnalytics(creatorId);
    res.json(analytics);
  }

  /**
   * Get analytics for a specific project
   * @route GET /api/analytics/projects/:id
   */
  async getProjectAnalytics(req: Request, res: Response<TProjectAnalytics>) {
    const projectId = req.params.id;
    const analytics =
      await this.analyticsService.getProjectAnalytics(projectId);
    res.json(analytics);
  }

  /**
   * Get trending creators with pagination
   * @route GET /api/analytics/trending/creators
   */
  async getTrendingCreators(
    req: Request<{}, {}, {}, { page?: string; limit?: string }>,
    res: Response<TPaginatedResponse<TCreator>>,
  ) {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');

    const trending = await this.analyticsService.getTrendingCreators(
      page,
      limit,
    );
    res.json(trending);
  }

  /**
   * Get trending projects with pagination
   * @route GET /api/analytics/trending/projects
   */
  async getTrendingProjects(
    req: Request<{}, {}, {}, { page?: string; limit?: string }>,
    res: Response<TPaginatedResponse<TProject>>,
  ) {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');

    const trending = await this.analyticsService.getTrendingProjects(
      page,
      limit,
    );
    res.json(trending);
  }

  /**
   * Get platform-wide metrics
   * @route GET /api/analytics/platform
   */
  async getPlatformMetrics(
    req: Request,
    res: Response<{
      engagement: {
        totalViews: number;
        totalLikes: number;
        totalFollows: number;
      };
      platform: {
        totalCreators: number;
        totalProjects: number;
      };
    }>,
  ) {
    const metrics = await this.analyticsService.getPlatformMetrics();
    res.json(metrics);
  }

  /**
   * Get time-based metrics
   * @route GET /api/analytics/time
   */
  async getTimeBasedMetrics(
    req: Request<{}, {}, {}, { startDate: string; endDate: string }>,
    res: Response<
      | Array<{
          date: Date;
          views: number;
          likes: number;
        }>
      | { error: string }
    >,
  ) {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format. Use ISO 8601 format.',
      });
    }

    const metrics = await this.analyticsService.getTimeBasedMetrics(
      startDate,
      endDate,
    );
    res.json(metrics);
  }
}
