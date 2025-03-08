import { CommentHandler } from '@/handlers/CommentHandler';
import { authenticate } from '@/middlewares/authenticate';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();

router.post('/', authenticate, catchAsync(CommentHandler.create));
router.get('/:id', catchAsync(CommentHandler.getById));
router.put('/:id', authenticate, catchAsync(CommentHandler.update));
router.delete('/:id', authenticate, catchAsync(CommentHandler.delete));
router.get(
  '/project/:projectId',
  catchAsync(CommentHandler.getProjectComments),
);
router.get(
  '/creator/:creatorId',
  catchAsync(CommentHandler.getCreatorComments),
);

export default router;
