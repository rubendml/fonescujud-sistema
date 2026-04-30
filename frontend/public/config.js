// ===============================
// CONFIGURACIÓN API (FRONTEND)
// ===============================

// Detectar si estamos en preview (ramas)
const isPreview = window.location.hostname.includes('vercel.app') &&
  window.location.hostname.includes('git-');

// Construir URL base correctamente
const API_BASE_URL = isPreview
  ? `${window.location.origin}/api`
  : 'https://fonescujud-sistema.vercel.app/api';

window.API_BASE_URL = API_BASE_URL;

console.log('🌐 API BASE URL:', API_BASE_URL);