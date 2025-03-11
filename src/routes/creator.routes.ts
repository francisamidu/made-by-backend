import { CreatorHandler } from '@/handlers/CreatorHandler';
import { authenticate } from '@/middlewares/authenticate';
import { validateCreator } from '@/middlewares/validateMiddleware';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, catchAsync(CreatorHandler.getAll));
router.post(
  '/',
  // authenticate,
  validateCreator,
  catchAsync(CreatorHandler.create),
);
router.get('/available', catchAsync(CreatorHandler.findAvailable));
router.get('/location/:location', catchAsync(CreatorHandler.findByLocation));
router.get('/:id', catchAsync(CreatorHandler.getById));
router.get('/:username', catchAsync(CreatorHandler.getByUsername));
router.put('/:id', authenticate, catchAsync(CreatorHandler.update));
router.delete('/:id', authenticate, catchAsync(CreatorHandler.delete));
router.put(
  '/:id/professional-info',
  authenticate,
  catchAsync(CreatorHandler.updateProfessionalInfo),
);
router.put('/:id/stats', authenticate, catchAsync(CreatorHandler.updateStats));
router.get('/:id/followers', catchAsync(CreatorHandler.getFollowers));
router.get('/:id/following', catchAsync(CreatorHandler.getFollowing));
router.get('/is-following', catchAsync(CreatorHandler.isFollowing));

export default router;
