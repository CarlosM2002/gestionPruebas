import express from 'express';
import { listTipos, createTipo, listComponentes, createComponente } from '../controllers/componentesController.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();
router.get('/tipos', authenticate, listTipos);
router.post('/tipos', authenticate, authorize(['Admin']), createTipo);
router.get('/', authenticate, listComponentes);
router.post('/', authenticate, authorize(['Admin']), createComponente);
export default router;
