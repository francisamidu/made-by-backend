// src/routes/analytics.routes.ts
import { AnalyticsHandler } from '@/handlers/AnalyticsHandler';
import { authenticate } from '@/middlewares/authenticate';
import { Router } from 'express';
import catchAsync from '@/utils/catchAsync';

const router = Router();
router.get(
  '/trending/creators',
  catchAsync(AnalyticsHandler.getTrendingCreators),
);
router.get(
  '/trending/projects',
  catchAsync(AnalyticsHandler.getTrendingProjects),
);
router.get(
  '/platform',
  authenticate,
  catchAsync(AnalyticsHandler.getPlatformMetrics),
);
router.get(
  '/time',
  authenticate,
  catchAsync(AnalyticsHandler.getTimeBasedMetrics),
);

router.get(
  '/creators/:id',
  authenticate,
  catchAsync(AnalyticsHandler.getCreatorAnalytics),
);
router.get(
  '/projects/:id',
  authenticate,
  catchAsync(AnalyticsHandler.getProjectAnalytics),
);
export default router;
