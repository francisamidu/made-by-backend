import express from 'express';
import catchAsync from '../utils/catchAsync';
import { UserHandler } from '@/handlers/UserHandler';
const router = express.Router();
router.get('/', catchAsync(UserHandler.getAllUsers));
router.get('/:id', catchAsync(UserHandler.getUserById));
router.post('/', catchAsync(UserHandler.createUser));
router.put('/:id', catchAsync(UserHandler.updateUser));
router.delete('/:id', catchAsync(UserHandler.deleteUser));
export default router;
//# sourceMappingURL=userRoutes.js.map