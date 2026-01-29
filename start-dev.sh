#!/bin/bash

# Script rápido para iniciar FONESCUJUD en desarrollo local
# Uso: bash start-dev.sh

clear

echo "╔════════════════════════════════════════════════════════╗"
echo "║        FONESCUJUD - INICIA SERVIDOR DESARROLLO         ║"
echo "║    Sistema de Gestión del Fondo de Empleados 2026      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para imprimir
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[ATENCIÓN]${NC} $1"
}

# 1. Verificar requisitos
log "Verificando requisitos..."

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js no está instalado${NC}"
    echo "Descarga desde: https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm no está instalado${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    warn "Python3 no encontrado. Necesitarás usar otra forma para servir frontend"
fi

success "Requisitos verificados"
echo ""

# 2. Verificar .env
log "Verificando configuración..."

if [ ! -f "backend/.env" ]; then
    warn "No se encuentra backend/.env"
    echo "  1. Ejecuta: cp backend/.env.example backend/.env"
    echo "  2. Edita backend/.env con tus credenciales Supabase"
    echo "  3. Vuelve a ejecutar este script"
    exit 1
fi

success "Configuración encontrada"
echo ""

# 3. Instalar dependencias backend
log "Instalando dependencias backend..."
cd backend
npm install > /dev/null 2>&1
success "Dependencias instaladas"
cd ..
echo ""

# 4. Iniciar servidor backend en background
log "Iniciando servidor backend en puerto 3000..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
success "Backend iniciado (PID: $BACKEND_PID)"
echo ""

# Esperar a que el servidor esté listo
sleep 2

# Verificar que el backend esté corriendo
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    success "Backend está respondiendo en http://localhost:3000"
else
    echo -e "${YELLOW}Advertencia: Backend podría no estar listo${NC}"
    echo "Revisa backend.log para errores"
fi

echo ""

# 5. Iniciar frontend
log "Iniciando servidor frontend en puerto 8000..."

if command -v python3 &> /dev/null; then
    cd frontend
    python3 -m http.server 8000 > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    success "Frontend iniciado (PID: $FRONTEND_PID)"
elif command -v python &> /dev/null; then
    cd frontend
    python -m SimpleHTTPServer 8000 > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    success "Frontend iniciado (PID: $FRONTEND_PID)"
else
    warn "Python no encontrado. Necesitas iniciar frontend manualmente"
    echo "  Ejecuta en otra terminal: cd frontend && python -m http.server 8000"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║         ✅ SERVIDORES INICIADOS CORRECTAMENTE         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

echo -e "${GREEN}URLs disponibles:${NC}"
echo ""
echo "  📊 Dashboard Público:"
echo "     http://localhost:8000/public/"
echo ""
echo "  👨‍💼 Panel Administrador:"
echo "     http://localhost:8000/admin/"
echo ""
echo "  👁️  Panel Revisor:"
echo "     http://localhost:8000/revisor/"
echo ""
echo "  🔌 API Backend:"
echo "     http://localhost:3000/api/"
echo ""
echo "  ✅ Health Check:"
echo "     http://localhost:3000/health"
echo ""

echo -e "${BLUE}Logs:${NC}"
echo "  Backend: tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""

echo -e "${YELLOW}Para detener los servidores:${NC}"
if [ ! -z "$BACKEND_PID" ] && [ ! -z "$FRONTEND_PID" ]; then
    echo "  kill $BACKEND_PID $FRONTEND_PID"
    echo "  o ejecuta: bash stop-dev.sh"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║            ¡Ahorrar es crecer! 💰                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Mantener script corriendo
wait
