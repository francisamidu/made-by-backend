import type { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { BadRequestError, NotFoundError } from '../utils/errors';

/**
 * Handler class for user-related HTTP requests
 * Processes incoming requests and returns appropriate responses
 */
export class UserHandler {
  /**
   * Retrieves all users from the database
   * @param _req - Express request object (unused)
   * @param res - Express response object
   */
  static async getAllUsers(_req: Request, res: Response): Promise<void> {
    const users = await UserService.findAll();
    res.status(200).json({
      success: true,
      data: users,
    });
  }

  /**
   * Retrieves a specific user by their ID
   * @param req - Express request object containing user ID
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if user doesn't exist
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid user ID');
    }

    const user = await UserService.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Creates a new user
   * @param req - Express request object containing user data
   * @param res - Express response object
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    const user = await UserService.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  }

  /**
   * Updates an existing user
   * @param req - Express request object containing user ID and update data
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if user doesn't exist
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid user ID');
    }

    const user = await UserService.update(id, req.body);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Deletes a user
   * @param req - Express request object containing user ID
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if user doesn't exist
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid user ID');
    }

    const success = await UserService.delete(id);
    if (!success) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    res.status(204).send();
  }
}
