import { AuthHandler } from '@/handlers/AuthHandler';
import { authenticate } from '@/middlewares/authenticate';
import { validateProvider } from '@/middlewares/validateProvider';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();

// OAuth routes for all providers
router.get(
  '/auth/:provider/login',
  validateProvider,
  catchAsync(AuthHandler.handleOAuth),
);
router.post('/login', catchAsync(AuthHandler.handleOAuthLogin));
router.post('/refresh', catchAsync(AuthHandler.refreshToken));
router.post('/logout', authenticate, catchAsync(AuthHandler.logout));
router.get('/validate', authenticate, catchAsync(AuthHandler.validateSession));
router.put(
  '/social-links',
  authenticate,
  catchAsync(AuthHandler.updateSocialLinks),
);

export default router;
