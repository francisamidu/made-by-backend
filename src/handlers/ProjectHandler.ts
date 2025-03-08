import { Response } from 'express';
import { ProjectService } from '@/services/ProjectService';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';

import {
  TCreateProjectRequest,
  TProjectSort,
  TPaginatedResponse,
  TProjectResponse,
  TProject,
  TProjectSortType,
} from '@/types/schema';
import { AppError } from '@/utils/errors';
import {
  SuccessResponse,
  ToggleLikeBody,
  LikeResponse,
  ProjectPathParams,
  ProjectQueryParams,
} from '@/types/query-params';

/**
 * Handler for project-related operations
 */
export class ProjectHandler {
  /**
   * Get all projects
   * @route GET /api/projects
   */
  static async getAllProjects(
    req: ApiRequest<{}, {}, ProjectQueryParams>,
    res: Response<ApiResponse<TPaginatedResponse<TProjectResponse>>>,
  ) {
    const { page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(String(page));
    const limitNumber = parseInt(String(limit));

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new AppError('Invalid pagination parameters', 400);
    }

    const projects = await ProjectService.findAll(pageNumber, limitNumber);

    res.json({
      data: projects,
      meta: {
        page: projects.page,
        limit: projects.limit,
        total: projects.total,
        hasMore: projects.hasMore,
      },
    });
  }

  /**
   * Create new project
   * @route POST /api/projects
   */
  static async create(
    req: ApiRequest<{ creatorId?: string }, TCreateProjectRequest>,
    res: Response<ApiResponse<TProject>>,
  ) {
    const { creatorId } = req.params;
    const project = await ProjectService.create(String(creatorId), req.body);

    res.status(201).json({
      data: project,
      meta: {
        creatorId,
        createdAt: project.createdAt,
      },
    });
  }

  /**
   * Get project by ID
   * @route GET /api/projects/:id
   */
  static async getById(
    req: ApiRequest<ProjectPathParams>,
    res: Response<ApiResponse<TProjectResponse>>,
  ) {
    const project = await ProjectService.findById(String(req.params.id));

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      data: project,
      meta: {
        creatorId: project.creatorId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  }

  /**
   * Update project
   * @route PUT /api/projects/:id
   */
  static async update(
    req: ApiRequest<ProjectPathParams, Partial<TCreateProjectRequest>>,
    res: Response<ApiResponse<TProject>>,
  ) {
    const updated = await ProjectService.update(
      String(req.params.id),
      req.body,
    );

    if (!updated) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      data: updated,
      meta: {
        updatedAt: updated.updatedAt,
        updatedFields: Object.keys(req.body),
      },
    });
  }

  /**
   * Delete project
   * @route DELETE /api/projects/:id
   */
  static async delete(
    req: ApiRequest<ProjectPathParams>,
    res: Response<ApiResponse<SuccessResponse>>,
  ) {
    const deleted = await ProjectService.delete(String(req.params.id));

    if (!deleted) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      data: { success: true },
      meta: {
        deletedAt: new Date().toISOString(),
        projectId: req.params.id,
      },
    });
  }

  /**
   * Get projects by tags
   * @route GET /api/projects/tags
   */
  static async getByTags(
    req: ApiRequest<{}, {}, ProjectQueryParams>,
    res: Response<ApiResponse<TPaginatedResponse<TProjectResponse>>>,
  ) {
    const { tags, page = '1', limit = '10' } = req.query;
    const projectTags = String(tags);

    if (!projectTags) {
      throw new AppError('Tags are required', 400);
    }

    const projects = await ProjectService.getByTags(
      projectTags.split(','),
      parseInt(String(page)),
      parseInt(String(limit)),
    );

    res.json({
      data: projects,
      meta: {
        tags: projectTags.split(','),
        page: projects.page,
        limit: projects.limit,
        total: projects.total,
        hasMore: projects.hasMore,
      },
    });
  }

  /**
   * Get sorted projects
   * @route GET /api/projects/sorted
   */
  static async getSorted(
    req: ApiRequest<{}, {}, ProjectQueryParams & { sortBy: TProjectSort }>,
    res: Response<ApiResponse<TPaginatedResponse<TProjectResponse>>>,
  ) {
    const { sortBy, page = '1', limit = '10' } = req.query;

    const projects = await ProjectService.getSorted(
      sortBy as TProjectSortType,
      parseInt(String(page)),
      parseInt(String(limit)),
    );

    res.json({
      data: projects,
      meta: {
        sortBy,
        page: projects.page,
        limit: projects.limit,
        total: projects.total,
        hasMore: projects.hasMore,
      },
    });
  }

  /**
   * Toggle project like
   * @route POST /api/projects/:id/like
   */
  static async toggleLike(
    req: ApiRequest<ProjectPathParams, ToggleLikeBody>,
    res: Response<ApiResponse<LikeResponse>>,
  ) {
    const { increment = true } = req.body;
    const likes = await ProjectService.toggleLike(
      String(req.params.id),
      increment,
    );

    res.json({
      data: { likes },
      meta: {
        projectId: req.params.id,
        action: increment ? 'increment' : 'decrement',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
