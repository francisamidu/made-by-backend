import { CreatorHandler } from '@/handlers/CreatorHandler';
import { authenticate } from '@/middlewares/authenticate';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();
const handler = new CreatorHandler();

router.get('/', catchAsync(handler.getAll));
router.get('/:id', catchAsync(handler.getById));
router.get('/username/:username', catchAsync(handler.getByUsername));
router.post('/', authenticate, catchAsync(handler.create));
router.put('/:id', authenticate, catchAsync(handler.update));
router.delete('/:id', authenticate, catchAsync(handler.delete));
router.put(
  '/:id/professional-info',
  authenticate,
  catchAsync(handler.updateProfessionalInfo),
);
router.put('/:id/stats', authenticate, catchAsync(handler.updateStats));
router.get('/location/:location', catchAsync(handler.findByLocation));
router.get('/available', catchAsync(handler.findAvailable));
router.get('/:id/followers', catchAsync(handler.getFollowers));
router.get('/:id/following', catchAsync(handler.getFollowing));
router.get('/is-following', catchAsync(handler.isFollowing));

export default router;
