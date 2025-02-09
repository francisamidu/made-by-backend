import type { Request, Response } from 'express';
import { SearchLogService } from '../services/SearchLogService';
import { BadRequestError, NotFoundError } from '../utils/errors';

export class SearchLogHandler {
  static async getAllSearchLogs(_req: Request, res: Response): Promise<void> {
    const categories = await SearchLogService.findAll();
    res.status(200).json({
      success: true,
      data: categories,
    });
  }

  static async getSearchLogById(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid SearchLog ID');
    }

    const SearchLog = await SearchLogService.findByUser(id);
    if (!SearchLog) {
      throw new NotFoundError(`Search Log with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: SearchLog,
    });
  }
}
