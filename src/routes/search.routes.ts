// src/routes/search.routes.ts
import AsyncRouter from '@/utils/asyncRouter';
import { SearchHandler } from '@/handlers/SearchHandler';

const router = new AsyncRouter();
const handler = new SearchHandler();

router.get('/all', handler.searchAll);
router.get('/creators', handler.searchCreators);
router.get('/projects', handler.searchProjects);
router.post('/advanced', handler.advancedSearch);
router.get('/suggestions', handler.getSearchSuggestions);

export default router.router;
