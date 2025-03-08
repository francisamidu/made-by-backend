import { Response } from 'express';
import { SearchService } from '@/services/SearchService';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';
import {
  TSearchParams,
  TPaginatedResponse,
  TCreator,
  TProjectResponse,
} from '@/types/schema';
import { AppError } from '@/utils/errors';
import { SearchQueryParams, GlobalSearchReults } from '@/types/query-params';

/**
 * Handler for search-related operations
 */
export class SearchHandler {
  /**
   * Perform global search
   * @route GET /api/search/all
   */
  static async searchAll(
    req: ApiRequest<{}, {}, SearchQueryParams>,
    res: Response<ApiResponse<GlobalSearchReults>>,
  ) {
    const { query, page = '1', limit = '10' } = req.query;

    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const results = await SearchService.searchAll(
      query as string,
      pageNumber,
      limitNumber,
    );

    res.json({
      data: results,
      meta: {
        query,
        page: pageNumber,
        limit: limitNumber,
        total: results.creators.total + results.projects.total,
        hasMore: results.creators.hasMore || results.projects.hasMore,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Search creators
   * @route GET /api/search/creators
   */
  static async searchCreators(
    req: ApiRequest<{}, {}, SearchQueryParams>,
    res: Response<
      ApiResponse<TPaginatedResponse<TCreator | Partial<TCreator>>>
    >,
  ) {
    const { query, page = '1', limit = '10' } = req.query;

    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const results = await SearchService.searchCreators(
      query as string,
      pageNumber,
      limitNumber,
    );

    res.json({
      data: results,
      meta: {
        query,
        page: pageNumber,
        limit: limitNumber,
        total: results.total,
        hasMore: results.hasMore,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Search projects
   * @route GET /api/search/projects
   */
  static async searchProjects(
    req: ApiRequest<{}, {}, SearchQueryParams>,
    res: Response<ApiResponse<TPaginatedResponse<TProjectResponse>>>,
  ) {
    const { query, page = '1', limit = '10' } = req.query;

    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const results = await SearchService.searchProjects(
      query as string,
      pageNumber,
      limitNumber,
    );

    res.json({
      data: results,
      meta: {
        query,
        page: pageNumber,
        limit: limitNumber,
        total: results.total,
        hasMore: results.hasMore,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Advanced search
   * @route POST /api/search/advanced
   */
  static async advancedSearch(
    req: ApiRequest<{}, TSearchParams>,
    res: Response<ApiResponse<TPaginatedResponse<TProjectResponse>>>,
  ) {
    const searchParams = req.body;

    if (!searchParams.query && !searchParams.tags?.length) {
      throw new AppError('Search query or tags are required', 400);
    }

    const results = await SearchService.advancedSearch(searchParams);

    res.json({
      data: results,
      meta: {
        ...searchParams,
        page: results.page,
        limit: results.limit,
        total: results.total,
        hasMore: results.hasMore,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get search suggestions
   * @route GET /api/search/suggestions
   */
  static async getSearchSuggestions(
    req: ApiRequest<{}, {}, SearchQueryParams>,
    res: Response<ApiResponse<string[]>>,
  ) {
    const { query, limit = '5' } = req.query;

    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const limitNumber = parseInt(limit as string);

    if (isNaN(limitNumber)) {
      throw new AppError('Invalid limit parameter', 400);
    }

    const suggestions = await SearchService.getSearchSuggestions(
      query as string,
      limitNumber,
    );

    res.json({
      data: suggestions,
      meta: {
        query,
        limit: limitNumber,
        total: suggestions.length,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
