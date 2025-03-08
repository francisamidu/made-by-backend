import { FollowHandler } from '@/handlers/FollowHandler';
import { authenticate } from '@/middlewares/authenticate';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();

router.post('/', authenticate, catchAsync(FollowHandler.create));
router.delete(
  '/:followerId/:followingId',
  authenticate,
  catchAsync(FollowHandler.delete),
);
router.get('/followers/:creatorId', catchAsync(FollowHandler.getFollowers));
router.get('/following/:creatorId', catchAsync(FollowHandler.getFollowing));
router.get(
  '/exists/:followerId/:followingId',
  catchAsync(FollowHandler.exists),
);
router.get('/counts/:creatorId', catchAsync(FollowHandler.getCounts));

export default router;
