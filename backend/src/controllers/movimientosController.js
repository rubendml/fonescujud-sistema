import { supabaseAdmin } from '../db.js';
import { calcularInteres } from '../utils/calculos.js';

// Obtener todos los movimientos de créditos
export const getAllMovimientos = async (req, res) => {
  try {
    console.log('[getAllMovimientos] Iniciando solicitud');
    const { data, error } = await supabaseAdmin
      .from('movimientos_creditos')
      .select(`
        id,
        credito_id,
        usuario_id,
        tipo_movimiento,
        monto,
        fecha_movimiento,
        descripcion,
        creditos(monto_original, saldo_actual, porcentaje_interes),
        usuarios(nombre, cedula)
      `)
      .order('fecha_movimiento', { ascending: false });

    if (error) {
      console.error('[getAllMovimientos] Supabase error:', error);
      throw error;
    }
    console.log('[getAllMovimientos] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getAllMovimientos] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener movimientos de un crédito específico
export const getMovimientosCredito = async (req, res) => {
  try {
    const { credito_id } = req.params;
    const creditoIdNum = parseInt(credito_id);
    console.log('[getMovimientosCredito] Iniciando solicitud para crédito:', creditoIdNum);

    if (Number.isNaN(creditoIdNum)) {
      return res.status(400).json({ error: 'credito_id inválido' });
    }

    const { data, error } = await supabaseAdmin
      .from('movimientos_creditos')
      .select(`
        *,
        creditos(monto_original, saldo_actual, porcentaje_interes),
        usuarios(nombre, cedula)
      `)
      .eq('credito_id', creditoIdNum)
      .order('fecha_movimiento', { ascending: false });

    if (error) {
      console.error('[getMovimientosCredito] Supabase error:', error);
      throw error;
    }
    let movimientos = data || [];

    const tieneInteres = movimientos.some(m => m.tipo_movimiento === 'interes');

    if (!tieneInteres) {
      const { data: creditoRef, error: errorCredito } = await supabaseAdmin
        .from('creditos')
        .select('id, usuario_id, monto_original, porcentaje_interes, fecha_desembolso')
        .eq('id', creditoIdNum)
        .single();

      if (errorCredito) {
        console.error('[getMovimientosCredito] Error al cargar crédito:', errorCredito);
        throw errorCredito;
      }

      if (creditoRef) {
        const interesInicial = calcularInteres(
          parseFloat(creditoRef.monto_original),
          parseFloat(creditoRef.porcentaje_interes),
          1
        );

        if (interesInicial > 0) {
          movimientos = [
            {
              id: `virtual-interes-inicial-${creditoIdNum}`,
              credito_id: creditoIdNum,
              usuario_id: creditoRef.usuario_id,
              tipo_movimiento: 'interes',
              monto: interesInicial,
              fecha_movimiento: creditoRef.fecha_desembolso,
              saldo_anterior: null,
              saldo_posterior: null,
              descripcion: `Interés inicial (${creditoRef.porcentaje_interes}%)`,
              creditos: creditoRef,
            },
            ...movimientos,
          ];
        }
      }
    }

    movimientos.sort((a, b) => new Date(b.fecha_movimiento) - new Date(a.fecha_movimiento));

    console.log('[getMovimientosCredito] Datos obtenidos:', movimientos.length, 'registros');
    res.json(movimientos);
  } catch (error) {
    console.error('[getMovimientosCredito] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener movimientos de un usuario
export const getMovimientosUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    console.log('[getMovimientosUsuario] Iniciando solicitud para usuario:', usuario_id);

    const { data, error } = await supabaseAdmin
      .from('movimientos_creditos')
      .select(`
        *,
        creditos(monto_original, saldo_actual, porcentaje_interes),
        usuarios(nombre, cedula)
      `)
      .eq('usuario_id', usuario_id)
      .order('fecha_movimiento', { ascending: false });

    if (error) {
      console.error('[getMovimientosUsuario] Supabase error:', error);
      throw error;
    }
    console.log('[getMovimientosUsuario] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getMovimientosUsuario] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener resumen de movimientos (para reportes)
export const getResumenMovimientos = async (req, res) => {
  try {
    console.log('[getResumenMovimientos] Iniciando solicitud');

    const { data: movimientos, error } = await supabaseAdmin
      .from('movimientos_creditos')
      .select('*');

    if (error) {
      console.error('[getResumenMovimientos] Supabase error:', error);
      throw error;
    }

    const resumen = {
      total_movimientos: movimientos.length,
      desembolsos: movimientos.filter(m => m.tipo_movimiento === 'desembolso').length,
      abonos: movimientos.filter(m => m.tipo_movimiento === 'abono').length,
      intereses: movimientos.filter(m => m.tipo_movimiento === 'interes').length,
      monto_total_desembolsado: movimientos
        .filter(m => m.tipo_movimiento === 'desembolso')
        .reduce((sum, m) => sum + m.monto, 0),
      monto_total_abonado: movimientos
        .filter(m => m.tipo_movimiento === 'abono')
        .reduce((sum, m) => sum + m.monto, 0),
      monto_total_interes: movimientos
        .filter(m => m.tipo_movimiento === 'interes')
        .reduce((sum, m) => sum + m.monto, 0),
    };

    console.log('[getResumenMovimientos] Resumen calculado');
    res.json(resumen);
  } catch (error) {
    console.error('[getResumenMovimientos] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};
