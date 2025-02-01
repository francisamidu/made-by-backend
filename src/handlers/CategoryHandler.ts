import type { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { BadRequestError, NotFoundError } from '../utils/errors';

export class CategoryHandler {
  static async getAllCategories(_req: Request, res: Response): Promise<void> {
    const categories = await CategoryService.findAll();
    res.status(200).json({
      success: true,
      data: categories,
    });
  }

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

  static async createCategory(req: Request, res: Response): Promise<void> {
    const category = await CategoryService.create(req.body);
    res.status(201).json({
      success: true,
      data: category,
    });
  }

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
