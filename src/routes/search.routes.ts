// src/routes/search.routes.ts
import { SearchHandler } from '@/handlers/SearchHandler';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();
const handler = new SearchHandler();

router.get('/all', catchAsync(handler.searchAll));
router.get('/creators', catchAsync(handler.searchCreators));
router.get('/projects', catchAsync(handler.searchProjects));
router.post('/advanced', catchAsync(handler.advancedSearch));
router.get('/suggestions', catchAsync(handler.getSearchSuggestions));

export default router;
