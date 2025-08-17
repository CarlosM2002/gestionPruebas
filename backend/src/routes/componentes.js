import { Router } from 'express';
import {
  listTipos, getTipo, createTipo, updateTipo, deleteTipo,
  listComponentes, getComponente, createComponente, updateComponente, deleteComponente
} from '../controllers/componentesController.js';

const router = Router();

// Tipos de componente
router.get('/tipos', listTipos);
router.get('/tipos/:id', getTipo);
router.post('/tipos', createTipo);
router.put('/tipos/:id', updateTipo);
router.delete('/tipos/:id', deleteTipo);

// Componentes
router.get('/', listComponentes);
router.get('/:id', getComponente);
router.post('/', createComponente);
router.put('/:id', updateComponente);
router.delete('/:id', deleteComponente);

export default router;