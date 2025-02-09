import express from 'express';
import catchAsync from '../utils/catchAsync';
import { UserHandler } from '@/handlers/UserHandler';

/**
 * Express router for user-related endpoints
 * Handles CRUD operations for user management
 */
const router = express.Router();

/**
 * User Routes:
 * GET    /          - Retrieve all users
 * GET    /:id       - Retrieve a specific user by ID
 * POST   /          - Create a new user
 * PUT    /:id       - Update an existing user
 * DELETE /:id       - Delete a user
 */
router.get('/', catchAsync(UserHandler.getAllUsers));
router.get('/:id', catchAsync(UserHandler.getUserById));
router.post('/', catchAsync(UserHandler.createUser));
router.put('/:id', catchAsync(UserHandler.updateUser));
router.delete('/:id', catchAsync(UserHandler.deleteUser));

export default router;
