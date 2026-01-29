# Guía de Instalación y Despliegue - FONESCUJUD

## ✅ Checklist de Instalación

### Fase 1: Preparación (5 minutos)

- [ ] Crear cuenta en Supabase (https://supabase.com)
- [ ] Crear nuevo proyecto en Supabase
- [ ] Copiar credenciales
- [ ] Tener Node.js instalado (v16+)
- [ ] Clonar/descargar el repositorio

### Fase 2: Base de Datos (10 minutos)

```bash
# En Supabase Console:
# 1. Ir a SQL Editor
# 2. Crear nueva query
# 3. Copiar contenido de database/schema.sql
# 4. Ejecutar
```

**Verificar**:
- ✓ Tablas creadas: usuarios, recaudo_cuotas, creditos, movimientos_creditos, multas, auditoria
- ✓ Índices creados
- ✓ Vistas creadas
- ✓ RLS habilitado

### Fase 3: Backend (15 minutos)

```bash
cd backend

# 1. Crear .env
cp .env.example .env

# 2. Llenar .env con credenciales Supabase
nano .env  # o usar tu editor favorito

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor
npm run dev
```

**Verificar**:
- ✓ Servidor running en http://localhost:3000
- ✓ Mensaje: "FONESCUJUD - Sistema de Fondo Backend Running"
- ✓ Health check: http://localhost:3000/health

### Fase 4: Frontend (5 minutos)

```bash
cd frontend

# Opción A: Usar Python
python -m http.server 8000

# Opción B: Usar http-server
npm install -g http-server
http-server .
```

**Acceso**:
- Dashboard Público: http://localhost:8000/public/
- Admin Panel: http://localhost:8000/admin/
- Revisor Panel: http://localhost:8000/revisor/

### Fase 5: Datos Iniciales (10 minutos)

Usar las APIs para cargar datos iniciales:

```bash
# 1. Crear usuarios
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "cedula": "1234567890",
    "email": "juan@example.com",
    "telefono": "3001234567",
    "afiliado": true,
    "cupos_mensuales": 3,
    "valor_cuota": 200000
  }'

# 2. Registrar cuota
curl -X POST http://localhost:3000/api/cuotas \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "mes": 1,
    "anio": 2026,
    "valor_pagado": 200000,
    "fecha_pago": "2026-01-15T00:00:00Z"
  }'
```

## 🚀 Despliegue en Producción

### Opción 1: Vercel (Frontend + Serverless)

```bash
# 1. Crear cuenta Vercel
# 2. Conectar repositorio GitHub
# 3. Configurar variables de entorno
# 4. Deploy automático en cada push
```

### Opción 2: Heroku (Backend + Frontend)

```bash
# Backend en Heroku
cd backend
heroku create fonescujud-backend
heroku config:set SUPABASE_URL=tu_url
heroku config:set SUPABASE_KEY=tu_key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=tu_service_key
heroku config:set JWT_SECRET=tu_secreto
git push heroku main

# Frontend en Vercel o GitHub Pages
cd frontend
vercel deploy
```

### Opción 3: DigitalOcean App Platform

```bash
# 1. Crear App en DigitalOcean
# 2. Conectar repositorio
# 3. Configurar como servicios (backend + frontend)
# 4. Aplicar variables de entorno
# 5. Deploy
```

## 📋 Requisitos de Producción

### Certificado SSL
- Obtener certificado SSL gratuito con Let's Encrypt
- Configurar en el servidor web

### Variables de Entorno Seguras
```bash
# Usar gestor de secretos:
# - GitHub Secrets
# - Vercel Environment Variables
# - DigitalOcean App Spec
```

### Backups
```bash
# Configurar backups automáticos en Supabase:
# 1. Project Settings → Backups
# 2. Enable automated backups
# 3. Frecuencia: Diaria
```

### Monitoreo
- Habilitar logs en Supabase
- Configurar alertas de error
- Monitoreo de rendimiento

## 🔄 Actualización a Producción

```bash
# 1. Crear rama de producción
git checkout -b production

# 2. Actualizar versión
npm version patch  # v1.0.1

# 3. Commit y push
git commit -am "Release v1.0.1"
git push origin production

# 4. Merge a main
git checkout main
git merge production

# 5. Deploy automático
# (según configuración de CI/CD)
```

## 🔐 Checklist de Seguridad

- [ ] Cambiar JWT_SECRET a valor fuerte
- [ ] Verificar variables de entorno
- [ ] SSL/TLS habilitado en producción
- [ ] CORS configurado correctamente
- [ ] Rate limiting configurado
- [ ] Validación de inputs en backend
- [ ] Sanitización de datos
- [ ] RLS habilitado en Supabase
- [ ] Backups automáticos activos
- [ ] Logs auditados y guardados

## 📞 Testing

### Test Manual del Flujo Completo

1. **Crear Usuario**
   - Nombre: Test User
   - Cédula: 9999999999
   - Email: test@example.com
   - Afiliado: Sí

2. **Registrar Cuota**
   - Mes: Enero 2026
   - Valor: 200,000 COP

3. **Crear Crédito**
   - Monto: 5,000,000 COP
   - Plazo: 12 meses
   - Tasa: 3% (afiliado)

4. **Verificar Dashboard**
   - Ingresos: 200,000 COP
   - Fondos en Préstamos: 5,000,000 COP
   - Por Cobrar: 5,000,000 + intereses

## ⚠️ Problemas Comunes

| Problema | Solución |
|----------|----------|
| Port 3000 ya en uso | `lsof -i :3000` y kill proceso |
| CORS error | Verificar configuración CORS en backend |
| DB no conecta | Verificar credenciales y VPN |
| Variables undefined | Verificar archivo .env existe |
| Imports no funcionan | Confirmar `"type": "module"` en package.json |

## 📞 Soporte Técnico

Si tienes problemas:

1. Revisar logs: `npm run dev` muestra errores detallados
2. Verificar console del navegador (F12)
3. Revisar Supabase Dashboard para estado de DB
4. Verificar que servidor backend está corriendo

---

**Tiempo total de instalación**: ~45 minutos
