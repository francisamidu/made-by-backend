import { CreatorHandler } from '@/handlers/CreatorHandler';
import AsyncRouter from '@/utils/AsyncRouter';
import { authenticate } from 'passport';

const router = new AsyncRouter();
const handler = new CreatorHandler();

router.get('/', handler.getAll);
router.get('/:id', handler.getById);
router.get('/username/:username', handler.getByUsername);
router.post('/', authenticate, handler.create);
router.put('/:id', authenticate, handler.update);
router.delete('/:id', authenticate, handler.delete);
router.put(
  '/:id/professional-info',
  authenticate,
  handler.updateProfessionalInfo,
);
router.put('/:id/stats', authenticate, handler.updateStats);
router.get('/location/:location', handler.findByLocation);
router.get('/available', handler.findAvailable);
router.get('/:id/followers', handler.getFollowers);
router.get('/:id/following', handler.getFollowing);
router.get('/is-following', handler.isFollowing);

export default router.router;
