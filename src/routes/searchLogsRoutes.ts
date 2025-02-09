import express from 'express';
import catchAsync from '@/utils/catchAsync';
import { SearchLogHandler } from '@/handlers/SearchLogs';

/**
 * Express router for search log-related endpoints
 * Handles operations for search history and analytics
 */
const router = express.Router();

/**
 * Search Log Routes:
 * GET /          - Retrieve all search logs
 * GET /:id       - Retrieve a specific search log by ID
 */
router.get('/', catchAsync(SearchLogHandler.getAllSearchLogs));
router.get('/:id', catchAsync(SearchLogHandler.getSearchLogById));

export default router;
