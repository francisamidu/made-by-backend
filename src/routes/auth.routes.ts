import { AuthHandler } from '@/handlers/AuthHandler';
import { authenticate } from '@/middlewares/authenticate';
import AsyncRouter from '@/utils/AsyncRouter';

const router = new AsyncRouter();
const handler = new AuthHandler();

router.post('/login', handler.handleOAuthLogin);
router.post('/refresh', handler.refreshToken);
router.post('/logout', authenticate, handler.logout);
router.get('/validate', authenticate, handler.validateSession);
router.put('/social-links', authenticate, handler.updateSocialLinks);

export default router.router;
