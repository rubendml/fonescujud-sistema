-- ========================================
-- SISTEMA DE GESTIÓN - FONDO FONESCUJUD
-- Script de creación de tablas
-- ========================================

-- 1. Tabla de Usuarios/Afiliados
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  afiliado BOOLEAN DEFAULT false,
  cupos_mensuales INTEGER DEFAULT 0,
  valor_cuota DECIMAL(12, 2) DEFAULT 200000.00,
  rol VARCHAR(50) DEFAULT 'revisor', -- 'admin' o 'revisor'
  estado BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_rol CHECK (rol IN ('admin', 'revisor'))
);

-- 2. Tabla de Recaudo de Cuotas
CREATE TABLE IF NOT EXISTS recaudo_cuotas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 13), -- 13 = cuota extraordinaria
  anio INTEGER NOT NULL,
  valor_pagado DECIMAL(12, 2) NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE NOT NULL,
  estado VARCHAR(50) DEFAULT 'pagado',
  descripcion TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, mes, anio),
  CONSTRAINT chk_estado_cuota CHECK (estado IN ('pagado', 'pendiente', 'cancelado'))
);

-- 3. Tabla de Créditos
CREATE TABLE IF NOT EXISTS creditos (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  monto_original DECIMAL(12, 2) NOT NULL,
  saldo_actual DECIMAL(12, 2) NOT NULL,
  plazo_meses INTEGER NOT NULL,
  porcentaje_interes DECIMAL(5, 2) NOT NULL, -- 3% para afiliados, 5% para no afiliados
  fecha_desembolso TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_ultimo_pago TIMESTAMP WITH TIME ZONE,
  interes_acumulado DECIMAL(12, 2) DEFAULT 0.00,
  interes_cobrado DECIMAL(12, 2) DEFAULT 0.00,
  estado VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_estado_credito CHECK (estado IN ('activo', 'pagado', 'cancelado', 'en mora'))
);

-- 4. Tabla de Movimientos de Créditos
CREATE TABLE IF NOT EXISTS movimientos_creditos (
  id BIGSERIAL PRIMARY KEY,
  credito_id BIGINT NOT NULL REFERENCES creditos(id) ON DELETE CASCADE,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_movimiento VARCHAR(50) NOT NULL,
  monto DECIMAL(12, 2) NOT NULL,
  fecha_movimiento TIMESTAMP WITH TIME ZONE NOT NULL,
  saldo_anterior DECIMAL(12, 2),
  saldo_posterior DECIMAL(12, 2),
  descripcion TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_tipo_movimiento CHECK (tipo_movimiento IN ('desembolso', 'abono', 'interes', 'ajuste'))
);

-- 5. Tabla de Multas por Mora
CREATE TABLE IF NOT EXISTS multas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  motivo VARCHAR(255) NOT NULL,
  valor DECIMAL(12, 2) NOT NULL,
  fecha_multa TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE,
  estado VARCHAR(50) DEFAULT 'pendiente',
  descripcion TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_estado_multa CHECK (estado IN ('pagada', 'pendiente', 'cancelada'))
);

-- 6. Tabla de Auditoría
CREATE TABLE IF NOT EXISTS auditoria (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  tabla_afectada VARCHAR(100) NOT NULL,
  operacion VARCHAR(50) NOT NULL,
  registro_id BIGINT,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  ip_address VARCHAR(50),
  fecha_operacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_operacion CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE'))
);

-- ========================================
-- Índices para optimizar búsquedas
-- ========================================

CREATE INDEX IF NOT EXISTS idx_usuarios_cedula ON usuarios(cedula);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_afiliado ON usuarios(afiliado);
CREATE INDEX IF NOT EXISTS idx_cuotas_usuario ON recaudo_cuotas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_cuotas_fecha ON recaudo_cuotas(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_creditos_usuario ON creditos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_creditos_estado ON creditos(estado);
CREATE INDEX IF NOT EXISTS idx_movimientos_credito ON movimientos_creditos(credito_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_creditos(fecha_movimiento);
CREATE INDEX IF NOT EXISTS idx_multas_usuario ON multas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_multas_estado ON multas(estado);
CREATE INDEX IF NOT EXISTS idx_auditoria_tabla ON auditoria(tabla_afectada);

-- ========================================
-- Funciones para auditoría automática
-- ========================================

CREATE OR REPLACE FUNCTION log_auditoria()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auditoria (
    tabla_afectada,
    operacion,
    registro_id,
    datos_anteriores,
    datos_nuevos
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers de auditoría
CREATE TRIGGER trigger_auditoria_usuarios
AFTER INSERT OR UPDATE OR DELETE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trigger_auditoria_cuotas
AFTER INSERT OR UPDATE OR DELETE ON recaudo_cuotas
FOR EACH ROW
EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trigger_auditoria_creditos
AFTER INSERT OR UPDATE OR DELETE ON creditos
FOR EACH ROW
EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trigger_auditoria_multas
AFTER INSERT OR UPDATE OR DELETE ON multas
FOR EACH ROW
EXECUTE FUNCTION log_auditoria();

-- ========================================
-- Vistas para reportes
-- ========================================

CREATE OR REPLACE VIEW vw_resumen_usuarios AS
SELECT
  COUNT(*) as total_usuarios,
  SUM(CASE WHEN afiliado THEN 1 ELSE 0 END) as afiliados,
  SUM(CASE WHEN NOT afiliado THEN 1 ELSE 0 END) as no_afiliados,
  SUM(CASE WHEN estado THEN 1 ELSE 0 END) as usuarios_activos
FROM usuarios;

CREATE OR REPLACE VIEW vw_resumen_cuotas AS
SELECT
  COUNT(*) as cantidad_pagos,
  SUM(valor_pagado) as total_recaudado,
  AVG(valor_pagado) as promedio_pago,
  MAX(fecha_pago) as ultima_cuota
FROM recaudo_cuotas
WHERE estado = 'pagado';

CREATE OR REPLACE VIEW vw_resumen_creditos AS
SELECT
  COUNT(*) as cantidad_creditos,
  COUNT(CASE WHEN estado = 'activo' THEN 1 END) as activos,
  COUNT(CASE WHEN estado = 'pagado' THEN 1 END) as pagados,
  SUM(monto_original) as total_desembolsado,
  SUM(saldo_actual) as total_saldo_pendiente,
  SUM(interes_acumulado) as total_interes_acumulado,
  SUM(interes_cobrado) as total_interes_cobrado
FROM creditos;

CREATE OR REPLACE VIEW vw_resumen_multas AS
SELECT
  COUNT(*) as cantidad_multas,
  COUNT(CASE WHEN estado = 'pagada' THEN 1 END) as pagadas,
  COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes,
  SUM(valor) as total_multas,
  SUM(CASE WHEN estado = 'pagada' THEN valor ELSE 0 END) as multas_recaudadas,
  SUM(CASE WHEN estado = 'pendiente' THEN valor ELSE 0 END) as multas_pendientes
FROM multas;

-- Habilitar RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE recaudo_cuotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE creditos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_creditos ENABLE ROW LEVEL SECURITY;
ALTER TABLE multas ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para acceso público (lectura en algunos casos)
CREATE POLICY "Usuarios can view dashboard" ON usuarios
FOR SELECT USING (true);

CREATE POLICY "Public can view dashboard summary" ON recaudo_cuotas
FOR SELECT USING (true);

-- ========================================
-- Fin del script
-- ========================================
