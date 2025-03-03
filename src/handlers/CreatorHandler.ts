// src/handlers/CreatorHandler.ts
import { Request, Response } from 'express';
import { CreatorService } from '@/services/CreatorService';
import { AppError } from '@/utils/errors';
import {
  TCreator,
  TProfessionalInfo,
  TCreatorStats,
  TableSchema,
} from '@/types/schema';

/**
 * Handler for creator-related operations
 */
export class CreatorHandler {
  /**
   * Get all creators
   * @route GET /api/creators
   */
  async getAll(
    req: Request,
    res: Response<
      TCreator[] | Partial<TCreator>[] | TableSchema['creators'] | null
    >,
  ) {
    const creators = await CreatorService.findAll();
    res.json(creators);
  }

  /**
   * Get creator by ID
   * @route GET /api/creators/:id
   */
  async getById(
    req: Request<{ id: string }>,
    res: Response<TCreator | Partial<TCreator> | null>,
  ) {
    const creator = await CreatorService.findById(req.params.id);

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    res.json(creator);
  }

  /**
   * Get creator by username
   * @route GET /api/creators/username/:username
   */
  async getByUsername(
    req: Request<{ username: string }>,
    res: Response<TCreator | Partial<TCreator> | null>,
  ) {
    const creator = await CreatorService.findByUsername(req.params.username);

    if (!creator) {
      throw new AppError('Creator not found', 404);
    }

    res.json(creator);
  }

  /**
   * Create new creator
   * @route POST /api/creators
   */
  async create(
    req: Request<{}, {}, Omit<TCreator, 'id' | 'createdAt' | 'updatedAt'>>,
    res: Response<TCreator | Partial<TCreator> | null>,
  ) {
    const creator = await CreatorService.create(req.body);
    res.status(201).json(creator);
  }

  /**
   * Update creator
   * @route PUT /api/creators/:id
   */
  async update(
    req: Request<
      { id: string },
      {},
      Partial<Omit<TCreator, 'id' | 'createdAt' | 'updatedAt'>>
    >,
    res: Response<TCreator | Partial<TCreator> | null>,
  ) {
    const updated = await CreatorService.update(req.params.id, req.body);

    if (!updated) {
      throw new AppError('Creator not found', 404);
    }

    res.json(updated);
  }

  /**
   * Update professional info
   * @route PUT /api/creators/:id/professional-info
   */
  async updateProfessionalInfo(
    req: Request<{ id: string }, {}, Partial<TProfessionalInfo>>,
    res: Response<TCreator | Partial<TCreator> | null>,
  ) {
    const updated = await CreatorService.updateProfessionalInfo(
      req.params.id,
      req.body,
    );

    if (!updated) {
      throw new AppError('Creator not found', 404);
    }

    res.json(updated);
  }

  /**
   * Update creator stats
   * @route PUT /api/creators/:id/stats
   */
  async updateStats(
    req: Request<{ id: string }, {}, Partial<TCreatorStats>>,
    res: Response<TCreator | Partial<TCreator> | null>,
  ) {
    const updated = await CreatorService.updateStats(req.params.id, req.body);

    if (!updated) {
      throw new AppError('Creator not found', 404);
    }

    res.json(updated);
  }

  /**
   * Delete creator
   * @route DELETE /api/creators/:id
   */
  async delete(
    req: Request<{ id: string }>,
    res: Response<{ success: boolean }>,
  ) {
    const success = await CreatorService.delete(req.params.id);

    if (!success) {
      throw new AppError('Creator not found', 404);
    }

    res.json({ success });
  }

  /**
   * Get creators by location
   * @route GET /api/creators/location/:location
   */
  async findByLocation(
    req: Request<{ location: string }>,
    res: Response<TCreator[] | Partial<TCreator>[]>,
  ) {
    const creators = await CreatorService.findByLocation(req.params.location);
    res.json(creators);
  }

  /**
   * Get available creators
   * @route GET /api/creators/available
   */
  async findAvailable(
    req: Request,
    res: Response<TCreator[] | Partial<TCreator>[]>,
  ) {
    const creators = await CreatorService.findAvailable();
    res.json(creators);
  }

  /**
   * Get creator followers
   * @route GET /api/creators/:id/followers
   */
  async getFollowers(
    req: Request<{ id: string }>,
    res: Response<TCreator[] | Partial<TCreator>[]>,
  ) {
    const followers = await CreatorService.getFollowers(req.params.id);
    res.json(followers);
  }

  /**
   * Get creators being followed
   * @route GET /api/creators/:id/following
   */
  async getFollowing(
    req: Request<{ id: string }>,
    res: Response<TCreator[] | Partial<TCreator>[]>,
  ) {
    const following = await CreatorService.getFollowing(req.params.id);
    res.json(following);
  }

  /**
   * Check if following
   * @route GET /api/creators/is-following
   */
  async isFollowing(
    req: Request<{}, {}, {}, { followerId: string; followingId: string }>,
    res: Response<{ isFollowing: boolean }>,
  ) {
    const { followerId, followingId } = req.query;
    const isFollowing = await CreatorService.isFollowing(
      followerId,
      followingId,
    );
    res.json({ isFollowing });
  }
}
