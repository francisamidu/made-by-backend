// src/routes/analytics.routes.ts
import AsyncRouter from '@/utils/AsyncRouter';
import { AnalyticsHandler } from '@/handlers/AnalyticsHandler';
import { authenticate } from '@/middlewares/authenticate';

const router = new AsyncRouter();
const handler = new AnalyticsHandler();

router.get('/creators/:id', authenticate, handler.getCreatorAnalytics);
router.get('/projects/:id', authenticate, handler.getProjectAnalytics);
router.get('/trending/creators', handler.getTrendingCreators);
router.get('/trending/projects', handler.getTrendingProjects);
router.get('/platform', authenticate, handler.getPlatformMetrics);
router.get('/time', authenticate, handler.getTimeBasedMetrics);

export default router.router;
