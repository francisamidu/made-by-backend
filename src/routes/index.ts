import { Router } from 'express';
import healthRouter from '@/handlers/app';

const router = Router();

router.use('/', healthRouter);

export default router;
