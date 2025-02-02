import express from 'express';
import catchAsync from '@/utils/catchAsync';
import { CategoryHandler } from '@/handlers/CategoryHandler';
const router = express.Router();
router.get('/', catchAsync(CategoryHandler.getAllCategories));
router.get('/:id', catchAsync(CategoryHandler.getCategoryById));
router.post('/', catchAsync(CategoryHandler.createCategory));
router.put('/:id', catchAsync(CategoryHandler.updateCategory));
router.delete('/:id', catchAsync(CategoryHandler.deleteCategory));
export default router;
//# sourceMappingURL=categoryRoutes.js.map