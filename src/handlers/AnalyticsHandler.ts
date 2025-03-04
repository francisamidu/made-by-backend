import { Response } from 'express';
import { AnalyticsService } from '@/services/AnalyticsService';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';
import {
  TCreatorAnalytics,
  TProjectAnalytics,
  TPaginatedResponse,
  TCreator,
  TProject,
} from '@/types/schema';
import { AppError } from '@/utils/errors';
import { PlatformMetrics, TimeMetrics } from '@/types/analytics';

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
  async getCreatorAnalytics(
    req: ApiRequest<{ id: string }>,
    res: Response<ApiResponse<TCreatorAnalytics>>,
  ) {
    const { id } = req.params;
    const analytics = await this.analyticsService.getCreatorAnalytics(id);

    res.json({
      data: analytics,
      meta: {
        creatorId: id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get analytics for a specific project
   * @route GET /api/analytics/projects/:id
   */
  async getProjectAnalytics(
    req: ApiRequest<{ id: string }>,
    res: Response<ApiResponse<TProjectAnalytics>>,
  ) {
    const { id } = req.params;
    const analytics = await this.analyticsService.getProjectAnalytics(id);

    res.json({
      data: analytics,
      meta: {
        projectId: id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get trending creators with pagination
   * @route GET /api/analytics/trending/creators
   */
  async getTrendingCreators(
    req: ApiRequest<{}, {}, { page?: string; limit?: string }>,
    res: Response<ApiResponse<TPaginatedResponse<TCreator>>>,
  ) {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const trending = await this.analyticsService.getTrendingCreators(
      page,
      limit,
    );

    res.json({
      data: trending,
      meta: {
        page,
        limit,
        total: trending.total,
        hasMore: trending.hasMore,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get trending projects with pagination
   * @route GET /api/analytics/trending/projects
   */
  async getTrendingProjects(
    req: ApiRequest<{}, {}, { page?: string; limit?: string }>,
    res: Response<ApiResponse<TPaginatedResponse<TProject>>>,
  ) {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const trending = await this.analyticsService.getTrendingProjects(
      page,
      limit,
    );

    res.json({
      data: trending,
      meta: {
        page,
        limit,
        total: trending.total,
        hasMore: trending.hasMore,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get platform-wide metrics
   * @route GET /api/analytics/platform
   */
  async getPlatformMetrics(
    req: ApiRequest,
    res: Response<ApiResponse<PlatformMetrics>>,
  ) {
    const metrics = await this.analyticsService.getPlatformMetrics();

    res.json({
      data: metrics,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get time-based metrics
   * @route GET /api/analytics/time
   */
  async getTimeBasedMetrics(
    req: ApiRequest<{}, {}, { startDate: string; endDate: string }>,
    res: Response<ApiResponse<TimeMetrics[]>>,
  ) {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AppError('Invalid date format. Use ISO 8601 format.', 400);
    }

    const metrics = await this.analyticsService.getTimeBasedMetrics(
      startDate,
      endDate,
    );

    res.json({
      data: metrics,
      meta: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        timespan: `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
