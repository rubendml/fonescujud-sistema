// ===============================
// CONFIGURACIÓN API (FRONTEND)
// ===============================

const API_BASE_URL =
  window.location.hostname.includes('git-')
    ? `${window.location.origin}/api`
    : 'https://fonescujud-sistema.vercel.app/api';

window.API_BASE_URL = API_BASE_URL;

console.log('🌐 API BASE URL:', API_BASE_URL);