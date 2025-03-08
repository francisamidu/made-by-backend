import { CreatorHandler } from '@/handlers/CreatorHandler';
import { authenticate } from '@/middlewares/authenticate';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();

router.get('/', catchAsync(CreatorHandler.getAll));
router.get('/:id', catchAsync(CreatorHandler.getById));
router.get('/username/:username', catchAsync(CreatorHandler.getByUsername));
router.post('/', authenticate, catchAsync(CreatorHandler.create));
router.put('/:id', authenticate, catchAsync(CreatorHandler.update));
router.delete('/:id', authenticate, catchAsync(CreatorHandler.delete));
router.put(
  '/:id/professional-info',
  authenticate,
  catchAsync(CreatorHandler.updateProfessionalInfo),
);
router.put('/:id/stats', authenticate, catchAsync(CreatorHandler.updateStats));
router.get('/location/:location', catchAsync(CreatorHandler.findByLocation));
router.get('/available', catchAsync(CreatorHandler.findAvailable));
router.get('/:id/followers', catchAsync(CreatorHandler.getFollowers));
router.get('/:id/following', catchAsync(CreatorHandler.getFollowing));
router.get('/is-following', catchAsync(CreatorHandler.isFollowing));

export default router;
