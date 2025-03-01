import express from 'express';
import catchAsync from '../utils/catchAsync';
import { TerminologyHandler } from '@/handlers/FollowHandler';

/**
 * Express router for terminology-related endpoints
 * Handles CRUD operations for terminology management
 */
const router = express.Router();

/**
 * @swagger
 * /api/terminologies:
 *   get:
 *     summary: Retrieve all terminologies
 *     tags: [Terminologies]
 *     responses:
 *       200:
 *         description: List of terminologies retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', catchAsync(TerminologyHandler.getAllTerminologies));

/**
 * @swagger
 * /api/terminologies/{id}:
 *   get:
 *     summary: Get terminology by ID
 *     tags: [Terminologies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Terminology ID
 *     responses:
 *       200:
 *         description: Terminology retrieved successfully
 *       404:
 *         description: Terminology not found
 */
router.get('/:id', catchAsync(TerminologyHandler.getTerminologyById));

/**
 * @swagger
 * /api/terminologies:
 *   post:
 *     summary: Create a new terminology
 *     tags: [Terminologies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - term
 *               - definition
 *               - categoryId
 *             properties:
 *               term:
 *                 type: string
 *               definition:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Draft, Reviewed, Approved]
 *     responses:
 *       201:
 *         description: Terminology created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', catchAsync(TerminologyHandler.createTerminology));

/**
 * @swagger
 * /api/terminologies/{id}:
 *   put:
 *     summary: Update a terminology
 *     tags: [Terminologies]
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
 *               term:
 *                 type: string
 *               definition:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Draft, Reviewed, Approved]
 *     responses:
 *       200:
 *         description: Terminology updated successfully
 *       404:
 *         description: Terminology not found
 */
router.put('/:id', catchAsync(TerminologyHandler.updateTerminology));

/**
 * @swagger
 * /api/terminologies/{id}:
 *   delete:
 *     summary: Delete a terminology
 *     tags: [Terminologies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Terminology deleted successfully
 *       404:
 *         description: Terminology not found
 */
router.delete('/:id', catchAsync(TerminologyHandler.deleteTerminology));

export default router;
