import express from 'express';
import {
  registrarMulta,
  pagarMulta,
  updateMulta,
  getMultaById,
  getMultasUsuario,
  getAllMultas,
  getResumenMultas,
} from '../controllers/multasController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/resumen', getResumenMultas);
router.get('/usuario/:usuario_id', getMultasUsuario);
router.get('/:id', getMultaById);
router.get('/', getAllMultas);

// Rutas protegidas
router.post('/', authMiddleware, adminOnly, registrarMulta);
router.patch('/:id/pagar', authMiddleware, adminOnly, pagarMulta);
router.patch('/:id', authMiddleware, adminOnly, updateMulta);

export default router;
