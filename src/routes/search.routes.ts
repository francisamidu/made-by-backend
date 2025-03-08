// src/routes/search.routes.ts
import { SearchHandler } from '@/handlers/SearchHandler';
import catchAsync from '@/utils/catchAsync';
import { Router } from 'express';

const router = Router();

router.get('/all', catchAsync(SearchHandler.searchAll));
router.get('/creators', catchAsync(SearchHandler.searchCreators));
router.get('/projects', catchAsync(SearchHandler.searchProjects));
router.post('/advanced', catchAsync(SearchHandler.advancedSearch));
router.get('/suggestions', catchAsync(SearchHandler.getSearchSuggestions));

export default router;
