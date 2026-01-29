import express from 'express';
import cors from 'cors';
import config from './config.js';
import usuariosRoutes from './routes/usuarios.js';
import cuotasRoutes from './routes/cuotas.js';
import creditosRoutes from './routes/creditos.js';
import multasRoutes from './routes/multas.js';
import dashboardRoutes from './routes/dashboard.js';
import movimientosRoutes from './routes/movimientos.js';
import authRoutes from './routes/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cuotas', cuotasRoutes);
app.use('/api/creditos', creditosRoutes);
app.use('/api/multas', multasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     FONESCUJUD - Sistema de Fondo      ║
║             Backend Running             ║
╠════════════════════════════════════════╣
║  Puerto: ${PORT}
║  Entorno: ${config.server.nodeEnv}
║  Supabase: ${config.supabase.url ? 'Conectado' : 'No configurado'}
╚════════════════════════════════════════╝
  `);
});

export default app;
