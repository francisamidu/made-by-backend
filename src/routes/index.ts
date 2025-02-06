import { Router } from 'express';
import categoryRoutes from './categoryRoutes';
import terminologyRoutes from './terminologyRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/category', categoryRoutes);
router.use('/terminology', terminologyRoutes);
router.use('/user', userRoutes);

export default router;
