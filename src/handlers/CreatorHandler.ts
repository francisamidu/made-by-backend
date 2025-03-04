import { Response } from 'express';
import { CreatorService } from '@/services/CreatorService';
import {
  TCreator,
  TProfessionalInfo,
  TCreatorStats,
  TableSchema,
} from '@/types/schema';
import { AppError } from '@/utils/errors';
import { CreateCreatorBody, UpdateCreatorBody } from '@/types/creator';
import { CreatorQueryParams, CreatorPathParams } from '@/types/query-params';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';
/**
 * Handler for creator-related operations
 */
export class CreatorHandler {
  /**
   * Get all creators
   * @route GET /api/creators
   */
  async getAll(
    req: ApiRequest<{}, {}, CreatorQueryParams>,
    res: Response<
      ApiResponse<TCreator[] | Partial<TCreator>[] | TableSchema['creators']>
    >,
  ) {
    const creators = await CreatorService.findAll();
    res.json({
      data: creators as TCreator[],
      meta: {
        count: creators?.length || 0,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get creator by ID
   * @route GET /api/creators/:id
   */
  async getById(
    req: ApiRequest<CreatorPathParams>,
    res: Response<ApiResponse<TCreator | Partial<TCreator>>>,
  ) {
    const creator = await CreatorService.findById(req.params.id);

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    res.json({
      data: creator,
      meta: {
        id: req.params.id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get creator by username
   * @route GET /api/creators/username/:username
   */
  async getByUsername(
    req: ApiRequest<CreatorPathParams>,
    res: Response<ApiResponse<TCreator | Partial<TCreator>>>,
  ) {
    const creator = await CreatorService.findByUsername(
      req.params.username as string,
    );

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    res.json({
      data: creator,
      meta: {
        username: req.params.username,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Create new creator
   * @route POST /api/creators
   */
  async create(
    req: ApiRequest<{}, CreateCreatorBody>,
    res: Response<ApiResponse<TCreator | Partial<TCreator>>>,
  ) {
    const creator = await CreatorService.create(req.body);

    res.status(201).json({
      data: creator as TCreator,
      meta: {
        createdAt: creator?.createdAt,
        email: creator?.email,
      },
    });
  }

  /**
   * Update creator
   * @route PUT /api/creators/:id
   */
  async update(
    req: ApiRequest<CreatorPathParams, UpdateCreatorBody>,
    res: Response<ApiResponse<TCreator | Partial<TCreator>>>,
  ) {
    const updated = await CreatorService.update(req.params.id, req.body);

    if (!updated) {
      throw new AppError('Creator not found', 404);
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
   * Update professional info
   * @route PUT /api/creators/:id/professional-info
   */
  async updateProfessionalInfo(
    req: ApiRequest<CreatorPathParams, Partial<TProfessionalInfo>>,
    res: Response<ApiResponse<TCreator | Partial<TCreator>>>,
  ) {
    const updated = await CreatorService.updateProfessionalInfo(
      req.params.id,
      req.body,
    );

    if (!updated) {
      throw new AppError('Creator not found', 404);
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
   * Update creator stats
   * @route PUT /api/creators/:id/stats
   */
  async updateStats(
    req: ApiRequest<CreatorPathParams, Partial<TCreatorStats>>,
    res: Response<ApiResponse<TCreator | Partial<TCreator>>>,
  ) {
    const updated = await CreatorService.updateStats(req.params.id, req.body);

    if (!updated) {
      throw new AppError('Creator not found', 404);
    }

    res.json({
      data: updated,
      meta: {
        updatedAt: updated.updatedAt,
        updatedStats: Object.keys(req.body),
      },
    });
  }

  /**
   * Delete creator
   * @route DELETE /api/creators/:id
   */
  async delete(
    req: ApiRequest<CreatorPathParams>,
    res: Response<ApiResponse<{ success: boolean }>>,
  ) {
    const success = await CreatorService.delete(req.params.id);

    if (!success) {
      throw new AppError('Creator not found', 404);
    }

    res.json({
      data: { success },
      meta: {
        deletedAt: new Date().toISOString(),
        creatorId: req.params.id,
      },
    });
  }

  /**
   * Get creators by location
   * @route GET /api/creators/location/:location
   */
  async findByLocation(
    req: ApiRequest<CreatorPathParams, {}, CreatorQueryParams>,
    res: Response<ApiResponse<TCreator[] | Partial<TCreator>[]>>,
  ) {
    const creators = await CreatorService.findByLocation(
      req.params.location as string,
    );

    res.json({
      data: creators,
      meta: {
        location: req.params.location,
        count: creators.length,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get available creators
   * @route GET /api/creators/available
   */
  async findAvailable(
    req: ApiRequest<{}, {}, CreatorQueryParams>,
    res: Response<ApiResponse<TCreator[] | Partial<TCreator>[]>>,
  ) {
    const creators = await CreatorService.findAvailable();

    res.json({
      data: creators,
      meta: {
        count: creators.length,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get creator followers
   * @route GET /api/creators/:id/followers
   */
  async getFollowers(
    req: ApiRequest<CreatorPathParams, {}, CreatorQueryParams>,
    res: Response<ApiResponse<TCreator[] | Partial<TCreator>[]>>,
  ) {
    const followers = await CreatorService.getFollowers(req.params.id);

    res.json({
      data: followers,
      meta: {
        creatorId: req.params.id,
        followerCount: followers.length,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get creators being followed
   * @route GET /api/creators/:id/following
   */
  async getFollowing(
    req: ApiRequest<CreatorPathParams, {}, CreatorQueryParams>,
    res: Response<ApiResponse<TCreator[] | Partial<TCreator>[]>>,
  ) {
    const following = await CreatorService.getFollowing(req.params.id);

    res.json({
      data: following,
      meta: {
        creatorId: req.params.id,
        followingCount: following.length,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Check if following
   * @route GET /api/creators/is-following
   */
  async isFollowing(
    req: ApiRequest<{}, {}, { followerId: string; followingId: string }>,
    res: Response<ApiResponse<{ isFollowing: boolean }>>,
  ) {
    const { followerId, followingId } = req.query;

    if (!followerId || !followingId) {
      throw new AppError('Both followerId and followingId are required', 400);
    }

    const isFollowing = await CreatorService.isFollowing(
      followerId,
      followingId,
    );

    res.json({
      data: { isFollowing },
      meta: {
        followerId,
        followingId,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
