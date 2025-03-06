import { AuthHandler } from '@/handlers/AuthHandler';
import { authenticate } from '@/middlewares/authenticate';
import AsyncRouter from '@/utils/AsyncRouter';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();
const handler = new AuthHandler();

router.post('/login', catchAsync(handler.handleOAuthLogin));
router.post('/refresh', catchAsync(handler.refreshToken));
router.post('/logout', authenticate, catchAsync(handler.logout));
router.get('/validate', authenticate, catchAsync(handler.validateSession));
router.put(
  '/social-links',
  authenticate,
  catchAsync(handler.updateSocialLinks),
);

export default router;
