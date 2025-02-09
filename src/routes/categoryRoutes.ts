import express from 'express';
import catchAsync from '@/utils/catchAsync';
import { CategoryHandler } from '@/handlers/CategoryHandler';

/**
 * Express router for category-related endpoints
 * Handles CRUD operations for category management
 */
const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', catchAsync(CategoryHandler.getAllCategories));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 */
router.get('/:id', catchAsync(CategoryHandler.getCategoryById));

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', catchAsync(CategoryHandler.createCategory));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/:id', catchAsync(CategoryHandler.updateCategory));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/:id', catchAsync(CategoryHandler.deleteCategory));

export default router;
