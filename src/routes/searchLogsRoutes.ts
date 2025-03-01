import express from 'express';
import catchAsync from '@/utils/catchAsync';
import { SearchLogHandler } from '@/handlers/CommentHandler';

/**
 * Express router for search log-related endpoints
 * Handles operations for search history and analytics
 */
const router = express.Router();

/**
 * @swagger
 * /api/search-logs:
 *   get:
 *     summary: Retrieve all search logs
 *     tags: [Search Logs]
 *     responses:
 *       200:
 *         description: List of search logs retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', catchAsync(SearchLogHandler.getAllSearchLogs));

/**
 * @swagger
 * /api/search-logs/{id}:
 *   get:
 *     summary: Get search log by ID
 *     tags: [Search Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Search Log ID
 *     responses:
 *       200:
 *         description: Search log retrieved successfully
 *       404:
 *         description: Search log not found
 */
router.get('/:id', catchAsync(SearchLogHandler.getSearchLogById));

export default router;
