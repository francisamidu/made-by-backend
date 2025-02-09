import express from 'express';
import catchAsync from '@/utils/catchAsync';
import { CategoryHandler } from '@/handlers/CategoryHandler';

/**
 * Express router for category-related endpoints
 * Handles CRUD operations for category management
 */
const router = express.Router();

/**
 * Category Routes:
 * GET    /          - Retrieve all categories
 * GET    /:id       - Retrieve a specific category by ID
 * POST   /          - Create a new category
 * PUT    /:id       - Update an existing category
 * DELETE /:id       - Delete a category
 */
router.get('/', catchAsync(CategoryHandler.getAllCategories));
router.get('/:id', catchAsync(CategoryHandler.getCategoryById));
router.post('/', catchAsync(CategoryHandler.createCategory));
router.put('/:id', catchAsync(CategoryHandler.updateCategory));
router.delete('/:id', catchAsync(CategoryHandler.deleteCategory));

export default router;
