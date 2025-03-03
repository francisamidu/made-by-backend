import { Request, Response } from 'express';
import { FollowService } from '@/services/FollowService';
import { TFollow, TCreator, TPaginatedResponse } from '@/types/schema';

/**
 * Handler for follow-related operations
 */
export class FollowHandler {
  private followService: FollowService;

  constructor() {
    this.followService = new FollowService();
  }

  /**
   * Create a follow relationship
   * @route POST /api/follows
   */
  async create(
    req: Request<{}, {}, { followerId: string; followingId: string }>,
    res: Response<TFollow>,
  ) {
    const { followerId, followingId } = req.body;
    const follow = await FollowService.create(followerId, followingId);
    res.status(201).json(follow);
  }

  /**
   * Remove a follow relationship
   * @route DELETE /api/follows/:followerId/:followingId
   */
  async delete(
    req: Request<{ followerId: string; followingId: string }>,
    res: Response<{ success: boolean }>,
  ) {
    const { followerId, followingId } = req.params;
    const result = await FollowService.delete(followerId, followingId);

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
  async getFollowers(
    req: Request<
      { creatorId: string },
      {},
      {},
      { page?: string; limit?: string }
    >,
    res: Response<TPaginatedResponse<TCreator | Partial<TCreator>>>,
  ) {
    const { creatorId } = req.params;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');

    const followers = await FollowService.getFollowers(creatorId, page, limit);
    res.json(followers);
  }

  /**
   * Get creators being followed by a creator
   * @route GET /api/follows/following/:creatorId
   */
  async getFollowing(
    req: Request<
      { creatorId: string },
      {},
      {},
      { page?: string; limit?: string }
    >,
    res: Response<TPaginatedResponse<TCreator | Partial<TCreator>>>,
  ) {
    const { creatorId } = req.params;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');

    const following = await FollowService.getFollowing(creatorId, page, limit);
    res.json(following);
  }

  /**
   * Check if a follow relationship exists
   * @route GET /api/follows/exists/:followerId/:followingId
   */
  async exists(
    req: Request<{ followerId: string; followingId: string }>,
    res: Response<{ exists: boolean }>,
  ) {
    const { followerId, followingId } = req.params;
    const exists = await FollowService.exists(followerId, followingId);
    res.json({ exists });
  }

  /**
   * Get follow counts for a creator
   * @route GET /api/follows/counts/:creatorId
   */
  async getCounts(
    req: Request<{ creatorId: string }>,
    res: Response<{ followers: number; following: number }>,
  ) {
    const { creatorId } = req.params;
    const counts = await FollowService.getCounts(creatorId);
    res.json(counts);
  }
}
