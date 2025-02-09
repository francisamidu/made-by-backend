import express from 'express';
import catchAsync from '../utils/catchAsync';
import { TerminologyHandler } from '@/handlers/TerminologyHandler';

/**
 * Express router for terminology-related endpoints
 * Handles CRUD operations for terminology management
 */
const router = express.Router();

/**
 * Terminology Routes:
 * GET    /          - Retrieve all terminologies
 * GET    /:id       - Retrieve a specific terminology by ID
 * POST   /          - Create a new terminology
 * PUT    /:id       - Update an existing terminology
 * DELETE /:id       - Delete a terminology
 */
router.get('/', catchAsync(TerminologyHandler.getAllTerminologies));
router.get('/:id', catchAsync(TerminologyHandler.getTerminologyById));
router.post('/', catchAsync(TerminologyHandler.createTerminology));
router.put('/:id', catchAsync(TerminologyHandler.updateTerminology));
router.delete('/:id', catchAsync(TerminologyHandler.deleteTerminology));

export default router;
