import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getAllMovimientos,
  getMovimientosCredito,
  getMovimientosUsuario,
  getResumenMovimientos
} from '../controllers/movimientosController.js';

const router = express.Router();

// Obtener todos los movimientos
router.get('/', authMiddleware, getAllMovimientos);

// Obtener resumen de movimientos
router.get('/resumen', authMiddleware, getResumenMovimientos);

// Obtener movimientos de un crédito específico
router.get('/credito/:credito_id', authMiddleware, getMovimientosCredito);

// Obtener movimientos de un usuario
router.get('/usuario/:usuario_id', authMiddleware, getMovimientosUsuario);

export default router;
