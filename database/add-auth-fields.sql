-- ========================================
-- Script para agregar campos de autenticación
-- Ejecutar ANTES de data-sample.sql si la tabla ya existe
-- ========================================

-- Agregar columnas usuario y password si no existen
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS usuario VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Actualizar usuarios existentes si es necesario
-- (Este script es seguro de ejecutar múltiples veces)

-- Verificar que los campos se agregaron
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name IN ('usuario', 'password')
ORDER BY ordinal_position;
