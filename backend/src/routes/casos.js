import express from 'express';
import { listCasos, createCaso, getCaso, updateCaso, deleteCaso } from '../controllers/casosController.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();


router.get('/', authenticate, listCasos);
router.get('/:id', authenticate, getCaso);
router.post('/', authenticate, createCaso);
router.put('/:id', authenticate, updateCaso);
router.delete('/:id', authenticate, deleteCaso);

export default router;
