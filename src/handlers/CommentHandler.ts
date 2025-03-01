import type { Request, Response } from 'express';
import { SearchLogService } from '../services/AnalyticsService';
import { BadRequestError, NotFoundError } from '../utils/errors';

/**
 * Handler class for search log-related HTTP requests
 * Processes incoming requests and returns appropriate responses
 */
export class SearchLogHandler {
  /**
   * Retrieves all search logs
   * @param _req - Express request object (unused)
   * @param res - Express response object
   */
  static async getAllSearchLogs(_req: Request, res: Response): Promise<void> {
    const categories = await SearchLogService.findAll();
    res.status(200).json({
      success: true,
      data: categories,
    });
  }

  /**
   * Retrieves search logs for a specific user
   * @param req - Express request object containing user ID
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if search log doesn't exist
   */
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
