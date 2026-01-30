import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllMovimientos,
  getMovimientosCredito,
  getMovimientosUsuario,
  getResumenMovimientos
} from '../controllers/movimientosController.js';

const router = express.Router();

// Obtener resumen de movimientos (ANTES de rutas comodín)
router.get('/resumen', authMiddleware, getResumenMovimientos);

// Obtener movimientos de un crédito específico
router.get('/credito/:credito_id', authMiddleware, getMovimientosCredito);

// Obtener movimientos de un usuario
router.get('/usuario/:usuario_id', authMiddleware, getMovimientosUsuario);

// Obtener todos los movimientos (AL FINAL, menos específico)
router.get('/', authMiddleware, getAllMovimientos);

export default router;
