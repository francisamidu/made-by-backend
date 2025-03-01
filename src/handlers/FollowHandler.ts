import type { Request, Response } from 'express';
import { TerminologyService } from '../services/ProjectService';
import { BadRequestError, NotFoundError } from '../utils/errors';

/**
 * Handler class for terminology-related HTTP requests
 * Processes incoming requests and returns appropriate responses
 */
export class TerminologyHandler {
  /**
   * Retrieves all terminology entries
   * @param _req - Express request object (unused)
   * @param res - Express response object
   */
  static async getAllTerminologies(
    _req: Request,
    res: Response,
  ): Promise<void> {
    const terminologies = await TerminologyService.findAll();
    res.status(200).json({
      success: true,
      data: terminologies,
    });
  }

  /**
   * Retrieves a specific terminology entry by ID
   * @param req - Express request object containing terminology ID
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if terminology doesn't exist
   */
  static async getTerminologyById(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid terminology ID');
    }

    const terminology = await TerminologyService.findById(id);
    if (!terminology) {
      throw new NotFoundError(`Terminology with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: terminology,
    });
  }

  /**
   * Creates a new terminology entry
   * @param req - Express request object containing terminology data
   * @param res - Express response object
   */
  static async createTerminology(req: Request, res: Response): Promise<void> {
    const terminology = await TerminologyService.create(req.body);
    res.status(201).json({
      success: true,
      data: terminology,
    });
  }

  /**
   * Updates an existing terminology entry
   * @param req - Express request object containing terminology ID and update data
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if terminology doesn't exist
   */
  static async updateTerminology(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid terminology ID');
    }

    const terminology = await TerminologyService.update(id, req.body);
    if (!terminology) {
      throw new NotFoundError(`Terminology with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: terminology,
    });
  }

  /**
   * Deletes a terminology entry
   * @param req - Express request object containing terminology ID
   * @param res - Express response object
   * @throws BadRequestError if ID is invalid
   * @throws NotFoundError if terminology doesn't exist
   */
  static async deleteTerminology(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params.id);
    if (isNaN(id)) {
      throw new BadRequestError('Invalid terminology ID');
    }

    const success = await TerminologyService.delete(id);
    if (!success) {
      throw new NotFoundError(`Terminology with ID ${id} not found`);
    }

    res.status(204).send();
  }
}
