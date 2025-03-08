import { ProjectHandler } from '@/handlers/ProjectHandler';
import { authenticate } from '@/middlewares/authenticate';
import { Router } from 'express';
import catchAsync from '@/utils/catchAsync';

const router = Router();

router.get('/', catchAsync(ProjectHandler.getAllProjects));
router.get('/:id', catchAsync(ProjectHandler.getById));
router.post('/', authenticate, catchAsync(ProjectHandler.create));
router.put('/:id', authenticate, catchAsync(ProjectHandler.update));
router.delete('/:id', authenticate, catchAsync(ProjectHandler.delete));
router.get('/tags/:tags', catchAsync(ProjectHandler.getByTags));
router.get('/sorted/:sortBy', catchAsync(ProjectHandler.getSorted));
router.post('/:id/like', authenticate, catchAsync(ProjectHandler.toggleLike));

export default router;
