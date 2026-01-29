import express from 'express';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuarioById,
} from '../controllers/usuariosController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);

// Rutas protegidas (requieren admin)
router.post('/', authMiddleware, adminOnly, createUsuario);
router.put('/:id', authMiddleware, adminOnly, updateUsuario);
router.delete('/:id', authMiddleware, adminOnly, deleteUsuario);

export default router;
