import { FollowHandler } from '@/handlers/FollowHandler';
import AsyncRouter from '@/utils/AsyncRouter';
import { authenticate } from 'passport';

const router = new AsyncRouter();
const handler = new FollowHandler();

router.post('/', authenticate, handler.create);
router.delete('/:followerId/:followingId', authenticate, handler.delete);
router.get('/followers/:creatorId', handler.getFollowers);
router.get('/following/:creatorId', handler.getFollowing);
router.get('/exists/:followerId/:followingId', handler.exists);
router.get('/counts/:creatorId', handler.getCounts);

export default router.router;
