import express from 'express';
import { listCasos, createCaso } from '../controllers/casosController.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();
router.get('/', authenticate, listCasos);
router.post('/', authenticate, authorize(['Admin']), createCaso);
export default router;
