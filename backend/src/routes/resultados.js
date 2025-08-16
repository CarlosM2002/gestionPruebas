import express from 'express';
import { registrarResultado, listarResultados } from '../controllers/resultadosController.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = express.Router();
router.post('/', authenticate, authorize(['Tester']), registrarResultado);
router.get('/', authenticate, authorize(['Dev','Admin']), listarResultados);
export default router;
