// src/routes/index.ts
import AsyncRouter from '@/utils/AsyncRouter';
import authRoutes from './auth.routes';
import analyticsRoutes from './analytics.routes';
import creatorRoutes from './creator.routes';
import commentRoutes from './comment.routes';
import followRoutes from './follower.routes';
import projectRoutes from './project.routes';
import searchRoutes from './search.routes';
import { Router } from 'express';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/creators', creatorRoutes);
router.use('/comments', commentRoutes);
router.use('/follows', followRoutes);
router.use('/projects', projectRoutes);
router.use('/search', searchRoutes);

export default router;
