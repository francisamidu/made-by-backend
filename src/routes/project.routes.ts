import { ProjectHandler } from '@/handlers/ProjectHandler';
import AsyncRouter from '@/utils/AsyncRouter';
import { authenticate } from '@/middlewares/authenticate';
import { Router } from 'express';
import catchAsync from '@/utils/catchAsync';

const router = Router();
const handler = new ProjectHandler();

router.get('/', catchAsync(handler.getAllProjects));
router.get('/:id', catchAsync(handler.getById));
router.post('/', authenticate, catchAsync(handler.create));
router.put('/:id', authenticate, catchAsync(handler.update));
router.delete('/:id', authenticate, catchAsync(handler.delete));
router.get('/tags/:tags', catchAsync(handler.getByTags));
router.get('/sorted/:sortBy', catchAsync(handler.getSorted));
router.post('/:id/like', authenticate, catchAsync(handler.toggleLike));

export default router;
