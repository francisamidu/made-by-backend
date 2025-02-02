import { TerminologyService } from '../services/TerminologyService';
import { BadRequestError, NotFoundError } from '../utils/errors';
export class TerminologyHandler {
    static async getAllTerminologies(_req, res) {
        const terminologies = await TerminologyService.findAll();
        res.status(200).json({
            success: true,
            data: terminologies,
        });
    }
    static async getTerminologyById(req, res) {
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
    static async createTerminology(req, res) {
        const terminology = await TerminologyService.create(req.body);
        res.status(201).json({
            success: true,
            data: terminology,
        });
    }
    static async updateTerminology(req, res) {
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
    static async deleteTerminology(req, res) {
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
