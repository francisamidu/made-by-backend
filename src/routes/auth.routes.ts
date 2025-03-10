import { AuthHandler } from '@/handlers/AuthHandler';
import { authenticate } from '@/middlewares/authenticate';
import { oAuthCallback } from '@/middlewares/oauthCallback';
import { validateProvider } from '@/middlewares/validateProvider';
import { validateRegistration } from '@/middlewares/validateRegistration';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();

// OAuth routes for all providers
router.get(
  '/:provider/login',
  validateProvider,
  catchAsync(AuthHandler.handleOAuth),
);
router.get(
  '/:provider/callback',
  validateProvider,
  oAuthCallback,
  catchAsync(AuthHandler.handleOAuthCallback),
);
router.post(
  '/login',
  validateRegistration,
  catchAsync(AuthHandler.handleOAuthLogin),
);
router.post(
  '/signup',
  validateRegistration,
  catchAsync(AuthHandler.handleOAuthLogin),
);
router.post('/refresh', catchAsync(AuthHandler.refreshToken));
router.post('/logout', authenticate, catchAsync(AuthHandler.logout));
router.get('/validate', authenticate, catchAsync(AuthHandler.validateSession));
router.put(
  '/social-links',
  authenticate,
  catchAsync(AuthHandler.updateSocialLinks),
);

export default router;
