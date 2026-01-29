import express from 'express';
import {
  crearCredito,
  registrarAbono,
  registrarInteres,
  getCreditosUsuario,
  getAllCreditos,
  getResumenCreditos,
  finalizarCredito,
} from '../controllers/creditosController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/resumen', getResumenCreditos);
router.get('/usuario/:usuario_id', getCreditosUsuario);
router.get('/', getAllCreditos);

// Rutas protegidas
router.post('/', authMiddleware, adminOnly, crearCredito);
router.post('/abono', authMiddleware, adminOnly, registrarAbono);

// Finalizar crédito (saldar/cancelar)
router.post('/finalizar', authMiddleware, adminOnly, finalizarCredito);
router.post('/interes', authMiddleware, adminOnly, registrarInteres);

export default router;
