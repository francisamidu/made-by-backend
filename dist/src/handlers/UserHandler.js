import { UserService } from '../services/UserService';
import { BadRequestError, NotFoundError } from '../utils/errors';
export class UserHandler {
    static async getAllUsers(_req, res) {
        const users = await UserService.findAll();
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    static async getUserById(req, res) {
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
    static async createUser(req, res) {
        const user = await UserService.create(req.body);
        res.status(201).json({
            success: true,
            data: user,
        });
    }
    static async updateUser(req, res) {
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
    static async deleteUser(req, res) {
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
//# sourceMappingURL=UserHandler.js.map