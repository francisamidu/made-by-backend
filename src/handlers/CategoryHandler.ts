import type { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { BadRequestError, NotFoundError } from '../utils/errors';

/**
 * Handler class for processing category-related HTTP requests
 * Manages the request/response cycle for category operations
 */
export class CategoryHandler {
  /**
   * Retrieves all categories
   * @param _req - Express request object (unused)
   * @param res - Express response object
   * @returns Promise<void>
   */
  static async getAllCategories(_req: Request, res: Response): Promise<void> {
    const categories = await CategoryService.findAll();
    res.status(200).json({
      success: true,
      data: categories,
    });
  }

  /**
   * Retrieves a specific category by ID
   * @param req - Express request object containing category ID
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if category doesn't exist
   * @returns Promise<void>
   */
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid category ID');
    }

    const category = await CategoryService.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  }

  /**
   * Creates a new category
   * @param req - Express request object containing category data in body
   * @param res - Express response object
   * @returns Promise<void>
   */
  static async createCategory(req: Request, res: Response): Promise<void> {
    const category = await CategoryService.create(req.body);
    res.status(201).json({
      success: true,
      data: category,
    });
  }

  /**
   * Updates an existing category
   * @param req - Express request object containing category ID and update data
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if category doesn't exist
   * @returns Promise<void>
   */
  static async updateCategory(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid category ID');
    }

    const category = await CategoryService.update(id, req.body);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  }

  /**
   * Deletes a category
   * @param req - Express request object containing category ID
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if category doesn't exist
   * @returns Promise<void>
   */
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid category ID');
    }

    const success = await CategoryService.delete(id);
    if (!success) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }

    res.status(204).send();
  }
}
