import { FollowHandler } from '@/handlers/FollowHandler';
import { authenticate } from '@/middlewares/authenticate';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();
const handler = new FollowHandler();

router.post('/', authenticate, catchAsync(handler.create));
router.delete(
  '/:followerId/:followingId',
  authenticate,
  catchAsync(handler.delete),
);
router.get('/followers/:creatorId', catchAsync(handler.getFollowers));
router.get('/following/:creatorId', catchAsync(handler.getFollowing));
router.get('/exists/:followerId/:followingId', catchAsync(handler.exists));
router.get('/counts/:creatorId', catchAsync(handler.getCounts));

export default router;
