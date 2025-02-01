import { Router } from 'express';
import categoryRoutes from './categoryRoutes';
import terminologyRoutes from './terminologyRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use(categoryRoutes);
router.use(terminologyRoutes);
router.use(userRoutes);

export default router;
