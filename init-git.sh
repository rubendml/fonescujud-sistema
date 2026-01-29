#!/bin/bash

# Script para inicializar repositorio Git y subir a GitHub
# Uso: bash init-git.sh

echo "╔════════════════════════════════════════╗"
echo "║  FONESCUJUD - Inicializador Git        ║"
echo "║  Sistema de Gestión del Fondo 2026     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colores para terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_step() {
    echo -e "${BLUE}[PASO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[ATENCIÓN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Verificar que estamos en la carpeta correcta
print_step "Verificando ubicación del proyecto..."
if [ ! -f "README.md" ]; then
    print_error "No se encuentra README.md. Asegúrate de estar en la carpeta fonescujud-sistema/"
    exit 1
fi
print_success "Carpeta correcta"
echo ""

# 2. Inicializar git
print_step "Inicializando repositorio Git..."
if [ -d ".git" ]; then
    print_warning "Git ya está inicializado"
else
    git init
    print_success "Repositorio Git creado"
fi
echo ""

# 3. Configurar git (opcional)
print_step "Configurar Git (opcional)"
read -p "¿Deseas configurar nombre de usuario? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    read -p "Nombre completo: " git_name
    read -p "Email: " git_email
    git config --global user.name "$git_name"
    git config --global user.email "$git_email"
    print_success "Git configurado"
fi
echo ""

# 4. Agregar archivos
print_step "Agregando archivos al repositorio..."
git add .
print_success "Archivos agregados"
echo ""

# 5. Crear primer commit
print_step "Creando primer commit..."
git commit -m "Initial commit: FONESCUJUD Sistema de Gestión v1.0

- Estructura base del proyecto
- Backend con Express.js
- Frontend (público, admin, revisor)
- Base de datos PostgreSQL en Supabase
- Scripts SQL de creación de tablas
- Documentación completa
- Archivos de configuración"

print_success "Primer commit creado"
echo ""

# 6. Mostrar estado
print_step "Estado del repositorio:"
git status
echo ""

# 7. Instrucciones para GitHub
echo "╔════════════════════════════════════════╗"
echo "║  PRÓXIMOS PASOS - SUBIR A GITHUB       ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}1. Crear repositorio en GitHub:${NC}"
echo "   https://github.com/new"
echo ""
echo -e "${YELLOW}2. Copiar el nombre exacto del repositorio${NC}"
echo ""
echo -e "${YELLOW}3. Ejecutar estos comandos:${NC}"
echo ""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/TU_USUARIO/fonescujud-sistema.git"
echo "   git push -u origin main"
echo ""
echo -e "${YELLOW}4. O si prefieres usar SSH:${NC}"
echo ""
echo "   git remote add origin git@github.com:TU_USUARIO/fonescujud-sistema.git"
echo "   git push -u origin main"
echo ""
echo -e "${GREEN}¡Proyecto listo para subir a GitHub!${NC}"
echo ""
echo "Ver logs: git log --oneline"
echo "Ver cambios: git diff"
echo ""
