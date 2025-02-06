import express from 'express';
import catchAsync from '@/utils/catchAsync';
import { SearchLogHandler } from '@/handlers/searchLogs';

const router = express.Router();

router.get('/', catchAsync(SearchLogHandler.getAllSearchLogs));
router.get('/:id', catchAsync(SearchLogHandler.getSearchLogById));

export default router;
