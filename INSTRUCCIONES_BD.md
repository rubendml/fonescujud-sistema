# Actualización de Base de Datos - Agregar Autenticación

## Problema Detectado
La tabla `usuarios` en Supabase no tiene los campos `usuario` y `password` que son necesarios para el login del sistema.

## Solución

### Paso 1: Ir a Supabase SQL Editor
1. Abre tu proyecto en Supabase: https://supabase.com/dashboard
2. Ve a la sección **SQL Editor** en el menú lateral

### Paso 2: Agregar campos de autenticación
Ejecuta el siguiente script SQL:

```sql
-- Agregar columnas usuario y password
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS usuario VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS password VARCHAR(255);
```

### Paso 3: Insertar usuarios admin y revisor
Ejecuta este script para crear los usuarios de administración:

```sql
-- Insertar usuarios admin y revisor
INSERT INTO usuarios (usuario, password, nombre, cedula, email, telefono, afiliado, cupos_mensuales, valor_cuota, rol, estado, fecha_creacion)
VALUES
  ('admin', 'Fonescujud2026*', 'Administrador del Sistema', '0000000000', 'admin@fonescujud.com', '3000000000', true, 0, 200000, 'admin', true, NOW()),
  ('revisor', 'Fonescujud2026+', 'Revisor del Sistema', '0000000001', 'revisor@fonescujud.com', '3000000001', true, 0, 200000, 'revisor', true, NOW())
ON CONFLICT (cedula) DO NOTHING;
```

### Paso 4: Actualizar usuarios existentes (si los hay)
Si ya tienes usuarios en la base de datos sin los campos `usuario` y `password`, ejecuta:

```sql
-- Actualizar usuarios existentes agregando nombre de usuario basado en email
UPDATE usuarios 
SET usuario = LOWER(SPLIT_PART(email, '@', 1)),
    password = 'cambiarme123'
WHERE usuario IS NULL AND email IS NOT NULL;
```

### Paso 5: Verificar
Ejecuta esta consulta para verificar que todo esté correcto:

```sql
SELECT id, usuario, nombre, email, rol, estado 
FROM usuarios 
WHERE usuario IN ('admin', 'revisor')
ORDER BY id;
```

Deberías ver dos usuarios:
- **admin** con rol 'admin'
- **revisor** con rol 'revisor'

## Credenciales de Acceso

**Administrador:**
- Usuario: `admin`
- Contraseña: `Fonescujud2026*`

**Revisor:**
- Usuario: `revisor`
- Contraseña: `Fonescujud2026+`

## Después de ejecutar estos scripts

Una vez ejecutados los scripts en Supabase, prueba el login en:
https://rubendml.github.io/fonescujud-sistema/login.html

El error 401 debería desaparecer y podrás iniciar sesión con las credenciales de admin.
