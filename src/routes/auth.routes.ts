import { Router } from 'express';
import { ValidationMiddleware } from '@/middlewares/validateAuth';
import { AuthHandler } from '@/handlers/AuthHandler';
import { authenticate } from '@/middlewares/authenticate';
import { oAuthCallback } from '@/middlewares/oauthCallback';
import { validateProvider } from '@/middlewares/validateProvider';
import { validateAuth } from '@/middlewares/validateAuth';
import catchAsync from '@/utils/catchAsync';

const router = Router();

router.post('/login', validateAuth, catchAsync(AuthHandler.handleLogin));
router.post(
  '/signup',
  validateAuth,
  ValidationMiddleware.registerValidation,
  ValidationMiddleware.passwordValidator,
  catchAsync(AuthHandler.handleRegister),
);
router.post('/refresh', catchAsync(AuthHandler.refreshToken));
router.post('/logout', authenticate, catchAsync(AuthHandler.logout));
router.get('/validate', authenticate, catchAsync(AuthHandler.validateSession));
router.put(
  '/social-links',
  authenticate,
  catchAsync(AuthHandler.updateSocialLinks),
);
// OAuth routes for all providers
router.get(
  '/:provider/login',
  validateProvider,
  catchAsync(AuthHandler.handleOAuth),
);
router.get(
  '/:provider/callback',
  oAuthCallback,
  catchAsync(AuthHandler.handleOAuthCallback),
);

export default router;
