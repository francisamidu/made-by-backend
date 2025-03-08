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
  /**
   * Get analytics for a specific creator
   * @route GET /api/analytics/creators/:id
   */
  static async getCreatorAnalytics(
    req: ApiRequest<{ id?: string }>,
    res: Response<ApiResponse<TCreatorAnalytics>>,
  ) {
    const { id } = req.params;
    const analytics = await AnalyticsService.getCreatorAnalytics(String(id));

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
  static async getProjectAnalytics(
    req: ApiRequest<{ id?: string }>,
    res: Response<ApiResponse<TProjectAnalytics>>,
  ) {
    const { id } = req.params;
    const analytics = await AnalyticsService.getProjectAnalytics(String(id));

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
  static async getTrendingCreators(
    req: ApiRequest<{}, {}, { page?: string; limit?: string }>,
    res: Response<ApiResponse<TPaginatedResponse<TCreator>>>,
  ) {
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const trending = await AnalyticsService.getTrendingCreators(page, limit);

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
  static async getTrendingProjects(
    req: ApiRequest<{}, {}, { page?: string; limit?: string }>,
    res: Response<ApiResponse<TPaginatedResponse<TProject>>>,
  ) {
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const trending = await AnalyticsService.getTrendingProjects(page, limit);

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
  static async getPlatformMetrics(
    req: ApiRequest,
    res: Response<ApiResponse<PlatformMetrics>>,
  ) {
    const metrics = await AnalyticsService.getPlatformMetrics();

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
  static async getTimeBasedMetrics(
    req: ApiRequest<{}, {}, { startDate: string; endDate: string }>,
    res: Response<ApiResponse<TimeMetrics[]>>,
  ) {
    const startDate = new Date(String(req.query.startDate));
    const endDate = new Date(String(req.query.endDate));

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AppError('Invalid date format. Use ISO 8601 format.', 400);
    }

    const metrics = await AnalyticsService.getTimeBasedMetrics(
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
