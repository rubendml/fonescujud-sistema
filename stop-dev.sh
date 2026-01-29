#!/bin/bash

# Script para detener los servidores de desarrollo
# Uso: bash stop-dev.sh

echo "Deteniendo servidores de FONESCUJUD..."
echo ""

# Detener procesos en puertos
echo "Buscando procesos en puertos 3000 y 8000..."

# Port 3000 (Backend)
BACKEND=$(lsof -t -i:3000)
if [ ! -z "$BACKEND" ]; then
    echo "Deteniendo backend en puerto 3000..."
    kill $BACKEND
    echo "✓ Backend detenido"
fi

# Port 8000 (Frontend)
FRONTEND=$(lsof -t -i:8000)
if [ ! -z "$FRONTEND" ]; then
    echo "Deteniendo frontend en puerto 8000..."
    kill $FRONTEND
    echo "✓ Frontend detenido"
fi

echo ""
echo "Todos los servidores han sido detenidos."
