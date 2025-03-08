import { FollowService } from '@/services/FollowService';
import { ApiRequest } from '@/types/request';
import { Response } from 'express';
import { TFollow, TPaginatedResponse, TCreator } from '@/types/schema';

/**
 * Handler for follow-related operations
 */
export class FollowHandler {
  /**
   * Create a follow relationship
   * @route POST /api/follows
   */
  static async create(
    req: ApiRequest<{}, {}, { followerId?: string; followingId?: string }>,
    res: Response<TFollow>,
  ) {
    const { followerId, followingId } = req.body;
    const follow = await FollowService.create(
      String(followerId),
      String(followingId),
    );
    res.status(201).json(follow);
  }

  /**
   * Remove a follow relationship
   * @route DELETE /api/follows/:followerId/:followingId
   */
  static async delete(
    req: ApiRequest<{ followerId?: string; followingId?: string }, {}, {}>,
    res: Response<{ success: boolean }>,
  ) {
    const { followerId, followingId } = req.params;
    const result = await FollowService.delete(
      String(followerId),
      String(followingId),
    );

    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  }

  /**
   * Get followers for a creator
   * @route GET /api/follows/followers/:creatorId
   */
  static async getFollowers(
    req: ApiRequest<
      { creatorId?: string },
      {},
      {},
      { page?: string; limit?: string }
    >,
    res: Response<TPaginatedResponse<TCreator | Partial<TCreator>>>,
  ) {
    const { creatorId } = req.params;
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));

    const followers = await FollowService.getFollowers(
      String(creatorId),
      page,
      limit,
    );
    res.json(followers);
  }

  /**
   * Get creators being followed by a creator
   * @route GET /api/follows/following/:creatorId
   */
  static async getFollowing(
    req: ApiRequest<
      { creatorId?: string },
      {},
      {},
      { page?: string; limit?: string }
    >,
    res: Response<TPaginatedResponse<TCreator | Partial<TCreator>>>,
  ) {
    const { creatorId } = req.params;
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));

    const following = await FollowService.getFollowing(
      String(creatorId),
      page,
      limit,
    );
    res.json(following);
  }

  /**
   * Check if a follow relationship exists
   * @route GET /api/follows/exists/:followerId/:followingId
   */
  static async exists(
    req: ApiRequest<{ followerId?: string; followingId?: string }>,
    res: Response<{ exists: boolean }>,
  ) {
    const { followerId, followingId } = req.params;
    const exists = await FollowService.exists(
      String(followerId),
      String(followingId),
    );
    res.json({ exists });
  }

  /**
   * Get follow counts for a creator
   * @route GET /api/follows/counts/:creatorId
   */
  static async getCounts(
    req: ApiRequest<{ creatorId?: string }>,
    res: Response<{ followers?: number; following?: number }>,
  ) {
    const { creatorId } = req.params;
    const counts = await FollowService.getCounts(String(creatorId));
    res.json(counts);
  }
}
