// src/routes/analytics.routes.ts
import AsyncRouter from '@/utils/AsyncRouter';
import { AnalyticsHandler } from '@/handlers/AnalyticsHandler';
import { authenticate } from '@/middlewares/authenticate';
import { Router } from 'express';
import catchAsync from '@/utils/catchAsync';

const router = Router();
const handler = new AnalyticsHandler();

router.get(
  '/creators/:id',
  authenticate,
  catchAsync(handler.getCreatorAnalytics),
);
router.get(
  '/projects/:id',
  authenticate,
  catchAsync(handler.getProjectAnalytics),
);
router.get('/trending/creators', catchAsync(handler.getTrendingCreators));
router.get('/trending/projects', catchAsync(handler.getTrendingProjects));
router.get('/platform', authenticate, catchAsync(handler.getPlatformMetrics));
router.get('/time', authenticate, catchAsync(handler.getTimeBasedMetrics));

export default router;
