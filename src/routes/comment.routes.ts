import { CommentHandler } from '@/handlers/CommentHandler';
import { authenticate } from '@/middlewares/authenticate';
import AsyncRouter from '@/utils/AsyncRouter';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();
const handler = new CommentHandler();

router.post('/', authenticate, catchAsync(handler.create));
router.get('/:id', catchAsync(handler.getById));
router.put('/:id', authenticate, catchAsync(handler.update));
router.delete('/:id', authenticate, catchAsync(handler.delete));
router.get('/project/:projectId', catchAsync(handler.getProjectComments));
router.get('/creator/:creatorId', catchAsync(handler.getCreatorComments));

export default router;
