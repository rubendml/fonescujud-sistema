import express from 'express';
import { getResumenGeneral } from '../controllers/dashboardController.js';

const router = express.Router();

// Ruta pública para el resumen general
router.get('/', getResumenGeneral);

export default router;
