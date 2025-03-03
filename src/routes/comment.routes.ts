import { CommentHandler } from '@/handlers/CommentHandler';
import AsyncRouter from '@/utils/AsyncRouter';
import { authenticate } from 'passport';

const router = new AsyncRouter();
const handler = new CommentHandler();

router.post('/', authenticate, handler.create);
router.get('/:id', handler.getById);
router.put('/:id', authenticate, handler.update);
router.delete('/:id', authenticate, handler.delete);
router.get('/project/:projectId', handler.getProjectComments);
router.get('/creator/:creatorId', handler.getCreatorComments);

export default router.router;
