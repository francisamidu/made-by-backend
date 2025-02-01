import express from 'express';
import catchAsync from '../utils/catchAsync';
import { TerminologyHandler } from '@/handlers/TerminologyHandler';

const router = express.Router();

router.get('/', catchAsync(TerminologyHandler.getAllTerminologies));
router.get('/:id', catchAsync(TerminologyHandler.getTerminologyById));
router.post('/', catchAsync(TerminologyHandler.createTerminology));
router.put('/:id', catchAsync(TerminologyHandler.updateTerminology));
router.delete('/:id', catchAsync(TerminologyHandler.deleteTerminology));
export default router;
