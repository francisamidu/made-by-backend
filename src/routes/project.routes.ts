import { ProjectHandler } from '@/handlers/ProjectHandler';
import AsyncRouter from '@/utils/AsyncRouter';
import { authenticate } from '@/middlewares/authenticate';

const router = new AsyncRouter();
const handler = new ProjectHandler();

router.get('/', handler.getAll);
router.get('/:id', handler.getById);
router.post('/', authenticate, handler.create);
router.put('/:id', authenticate, handler.update);
router.delete('/:id', authenticate, handler.delete);
router.get('/tags/:tags', handler.getByTags);
router.get('/sorted/:sortBy', handler.getSorted);
router.post('/:id/like', authenticate, handler.toggleLike);

export default router.router;
