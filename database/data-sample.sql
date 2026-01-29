-- Script de datos iniciales para FONESCUJUD
-- Ejecutar DESPUÉS de crear las tablas con schema.sql

-- ========================================
-- Datos de prueba - Usuarios
-- ========================================

INSERT INTO usuarios (nombre, cedula, email, telefono, afiliado, cupos_mensuales, valor_cuota, rol, estado, fecha_creacion)
VALUES
  ('Juan Carlos Pérez López', '1234567890', 'juan.perez@email.com', '3001234567', true, 3, 200000, 'admin', true, NOW()),
  ('María García Rodríguez', '1234567891', 'maria.garcia@email.com', '3001234568', true, 2, 200000, 'revisor', true, NOW()),
  ('Carlos Eduardo Martínez', '1234567892', 'carlos.martinez@email.com', '3001234569', false, 0, 200000, 'revisor', true, NOW()),
  ('Ana Isabel Sánchez', '1234567893', 'ana.sanchez@email.com', '3001234570', true, 4, 200000, 'revisor', true, NOW()),
  ('Luis Fernando Ramírez', '1234567894', 'luis.ramirez@email.com', '3001234571', false, 0, 200000, 'revisor', true, NOW()),
  ('Sandra Milena Gómez', '1234567895', 'sandra.gomez@email.com', '3001234572', true, 2, 200000, 'revisor', true, NOW()),
  ('Roberto José Hernández', '1234567896', 'roberto.hernandez@email.com', '3001234573', true, 3, 200000, 'revisor', true, NOW()),
  ('Claudia Lorena Díaz', '1234567897', 'claudia.diaz@email.com', '3001234574', false, 0, 200000, 'revisor', true, NOW()),
  ('Miguel Ángel Castro', '1234567898', 'miguel.castro@email.com', '3001234575', true, 2, 200000, 'revisor', true, NOW()),
  ('Patricia Elena Álvarez', '1234567899', 'patricia.alvarez@email.com', '3001234576', true, 3, 200000, 'revisor', true, NOW());

-- ========================================
-- Datos de prueba - Cuotas
-- ========================================

-- Cuotas enero 2026
INSERT INTO recaudo_cuotas (usuario_id, mes, anio, valor_pagado, fecha_pago, estado, descripcion)
VALUES
  (1, 1, 2026, 200000, '2026-01-10T00:00:00Z', 'pagado', 'Cuota enero - Usuario 1'),
  (2, 1, 2026, 200000, '2026-01-12T00:00:00Z', 'pagado', 'Cuota enero - Usuario 2'),
  (3, 1, 2026, 200000, '2026-01-15T00:00:00Z', 'pagado', 'Cuota enero - Usuario 3'),
  (4, 1, 2026, 200000, '2026-01-08T00:00:00Z', 'pagado', 'Cuota enero - Usuario 4'),
  (6, 1, 2026, 200000, '2026-01-20T00:00:00Z', 'pagado', 'Cuota enero - Usuario 6'),
  (7, 1, 2026, 200000, '2026-01-05T00:00:00Z', 'pagado', 'Cuota enero - Usuario 7'),
  (9, 1, 2026, 200000, '2026-01-18T00:00:00Z', 'pagado', 'Cuota enero - Usuario 9'),
  (10, 1, 2026, 200000, '2026-01-22T00:00:00Z', 'pagado', 'Cuota enero - Usuario 10');

-- ========================================
-- Datos de prueba - Créditos
-- ========================================

INSERT INTO creditos (usuario_id, monto_original, saldo_actual, plazo_meses, porcentaje_interes, fecha_desembolso, interes_acumulado, interes_cobrado, estado, fecha_creacion)
VALUES
  (1, 5000000, 4500000, 12, 3.0, '2025-12-01T00:00:00Z', 50000, 150000, 'activo', NOW()),
  (2, 3000000, 2700000, 12, 3.0, '2025-12-15T00:00:00Z', 30000, 90000, 'activo', NOW()),
  (4, 7000000, 6300000, 24, 3.0, '2025-11-01T00:00:00Z', 140000, 420000, 'activo', NOW()),
  (5, 2000000, 1800000, 6, 5.0, '2025-10-01T00:00:00Z', 60000, 100000, 'activo', NOW()),
  (7, 4500000, 3600000, 18, 3.0, '2025-09-01T00:00:00Z', 112500, 337500, 'activo', NOW());

-- ========================================
-- Datos de prueba - Movimientos de Créditos
-- ========================================

INSERT INTO movimientos_creditos (credito_id, usuario_id, tipo_movimiento, monto, fecha_movimiento, descripcion)
VALUES
  (1, 1, 'desembolso', 5000000, '2025-12-01T00:00:00Z', 'Desembolso inicial crédito 1'),
  (1, 1, 'interes', 150000, '2025-12-01T00:00:00Z', 'Interés primer mes (3%)'),
  (1, 1, 'abono', 500000, '2025-12-20T00:00:00Z', 'Abono parcial'),
  (2, 2, 'desembolso', 3000000, '2025-12-15T00:00:00Z', 'Desembolso inicial crédito 2'),
  (2, 2, 'interes', 90000, '2025-12-15T00:00:00Z', 'Interés primer mes (3%)'),
  (3, 4, 'desembolso', 7000000, '2025-11-01T00:00:00Z', 'Desembolso inicial crédito 3'),
  (3, 4, 'interes', 420000, '2025-11-01T00:00:00Z', 'Interés primer mes y posteriores'),
  (4, 5, 'desembolso', 2000000, '2025-10-01T00:00:00Z', 'Desembolso inicial crédito 4'),
  (4, 5, 'interes', 100000, '2025-10-01T00:00:00Z', 'Interés primer mes (5%)'),
  (5, 7, 'desembolso', 4500000, '2025-09-01T00:00:00Z', 'Desembolso inicial crédito 5'),
  (5, 7, 'interes', 337500, '2025-09-01T00:00:00Z', 'Interés primer mes y posteriores');

-- ========================================
-- Datos de prueba - Multas
-- ========================================

INSERT INTO multas (usuario_id, motivo, valor, fecha_multa, fecha_pago, estado, descripcion)
VALUES
  (3, 'Mora en pago cuota diciembre 2025', 50000, '2025-12-31T00:00:00Z', NULL, 'pendiente', 'Usuario sin pagar cuota extraordinaria'),
  (5, 'Mora en pago cuota enero 2026', 40000, '2026-01-31T00:00:00Z', NULL, 'pendiente', 'Usuario con atraso en cuota ordinaria'),
  (8, 'Mora reiterada - 3 meses sin pagar', 150000, '2025-12-15T00:00:00Z', '2026-01-10T00:00:00Z', 'pagada', 'Usuario pagó después de llamada'),
  (9, 'Incumplimiento de pago crédito', 75000, '2025-11-30T00:00:00Z', '2025-12-05T00:00:00Z', 'pagada', 'Pago de castigo por atraso');

-- ========================================
-- Resumen de datos iniciales
-- ========================================

-- Total usuarios: 10 (7 afiliados, 3 no afiliados)
-- Cuotas pagadas enero: 8 usuarios = 1,600,000 COP
-- Créditos activos: 5 créditos = 21,500,000 COP desembolsados
-- Multas: 4 registros (2 pagadas, 2 pendientes) = 315,000 COP

-- Verificar inserción
SELECT 'Usuarios' as tabla, COUNT(*) as cantidad FROM usuarios
UNION ALL
SELECT 'Cuotas', COUNT(*) FROM recaudo_cuotas
UNION ALL
SELECT 'Créditos', COUNT(*) FROM creditos
UNION ALL
SELECT 'Multas', COUNT(*) FROM multas
UNION ALL
SELECT 'Movimientos', COUNT(*) FROM movimientos_creditos;
