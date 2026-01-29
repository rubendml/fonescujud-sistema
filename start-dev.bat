@echo off
REM Script para iniciar FONESCUJUD en desarrollo local (Windows)
REM Uso: start-dev.bat

cls
color 0F

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        FONESCUJUD - INICIA SERVIDOR DESARROLLO         ║
echo ║    Sistema de Gestión del Fondo de Empleados 2026      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM 1. Verificar que estamos en la carpeta correcta
if not exist "backend\package.json" (
    echo [ERROR] No se encuentra backend\package.json
    echo Asegúrate de estar en la carpeta fonescujud-sistema
    pause
    exit /b 1
)

if not exist "frontend\public" (
    echo [ERROR] No se encuentra frontend\public
    pause
    exit /b 1
)

echo [INFO] Verificando configuración...

if not exist "backend\.env" (
    echo [ERROR] No se encuentra backend\.env
    echo.
    echo Acciones:
    echo   1. Copia: backend\.env.example a backend\.env
    echo   2. Edita backend\.env con tus credenciales Supabase
    echo   3. Vuelve a ejecutar este script
    pause
    exit /b 1
)

echo [OK] Configuración encontrada
echo.

echo [INFO] Instalando dependencias backend...
cd backend
call npm install > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
cd ..
echo.

echo [INFO] Iniciando servidor backend en puerto 3000...
echo Abre una nueva ventana de terminal/PowerShell y ejecuta:
echo   cd backend
echo   npm run dev
echo.
echo [ESPERANDO] Presiona cualquier tecla cuando el backend esté corriendo...
pause

echo.
echo [INFO] Iniciando servidor frontend en puerto 8000...
echo Abre otra nueva ventana de terminal/PowerShell y ejecuta:
echo   cd frontend
echo   python -m http.server 8000
echo.
echo [ESPERANDO] Presiona cualquier tecla cuando el frontend esté corriendo...
pause

cls
color 0A

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║         ✓ SERVIDORES INICIADOS CORRECTAMENTE         ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo URLs disponibles:
echo.
echo   📊 Dashboard Público:
echo      http://localhost:8000/public/
echo.
echo   👨‍💼 Panel Administrador:
echo      http://localhost:8000/admin/
echo.
echo   👁️  Panel Revisor:
echo      http://localhost:8000/revisor/
echo.
echo   🔌 API Backend:
echo      http://localhost:3000/api/
echo.
echo   ✓ Health Check:
echo      http://localhost:3000/health
echo.

echo Mantén estas ventanas abiertas mientras desarrollas.
echo.
echo ¡Ahorrar es crecer! 💰
echo.
pause
