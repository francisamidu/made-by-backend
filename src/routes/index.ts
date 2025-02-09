import { Router } from 'express';
import categoryRoutes from './categoryRoutes';
import searchLogsRoutes from './searchLogsRoutes';
import terminologyRoutes from './terminologyRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/search-logs', searchLogsRoutes);
router.use('/terminologies', terminologyRoutes);
router.use('/users', userRoutes);

export default router;
