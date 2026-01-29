import supabase, { supabaseAdmin } from '../db.js';
import { calcularInteres } from '../utils/calculos.js';

// Registrar nueva cuota pagada
export const registrarCuota = async (req, res) => {
  try {
    const { usuario_id, mes, anio, valor_pagado, fecha_pago } = req.body;
    console.log('[registrarCuota] Insertando nueva cuota para usuario:', usuario_id);

    const { data, error } = await supabaseAdmin
      .from('recaudo_cuotas')
      .insert([
        {
          usuario_id,
          mes,
          anio,
          valor_pagado,
          fecha_pago: fecha_pago || new Date().toISOString(),
          estado: 'pagado',
        },
      ])
      .select();

    if (error) {
      console.error('[registrarCuota] Supabase error:', error);
      throw error;
    }
    console.log('[registrarCuota] Cuota insertada exitosamente');
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('[registrarCuota] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener cuotas de un usuario
export const getCuotasUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    console.log('[getCuotasUsuario] Iniciando solicitud para usuario:', usuario_id);

    const { data, error } = await supabase
      .from('recaudo_cuotas')
      .select('*')
      .eq('usuario_id', usuario_id)
      .order('anio', { ascending: false })
      .order('mes', { ascending: false });

    if (error) {
      console.error('[getCuotasUsuario] Supabase error:', error);
      throw error;
    }
    console.log('[getCuotasUsuario] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getCuotasUsuario] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las cuotas
export const getAllCuotas = async (req, res) => {
  try {
    console.log('[getAllCuotas] Iniciando solicitud');
    const { data, error } = await supabase
      .from('recaudo_cuotas')
      .select('*, usuarios(nombre, cedula)')
      .order('anio', { ascending: false })
      .order('mes', { ascending: false });

    if (error) {
      console.error('[getAllCuotas] Supabase error:', error);
      throw error;
    }
    console.log('[getAllCuotas] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getAllCuotas] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener resumen de cuotas
export const getResumenCuotas = async (req, res) => {
  try {
    console.log('[getResumenCuotas] Iniciando solicitud');
    const { data: cuotas, error } = await supabase
      .from('recaudo_cuotas')
      .select('valor_pagado')
      .eq('estado', 'pagado');

    if (error) {
      console.error('[getResumenCuotas] Supabase error:', error);
      throw error;
    }

    const total = cuotas.reduce((sum, cuota) => sum + cuota.valor_pagado, 0);
    const cantidad = cuotas.length;
    console.log('[getResumenCuotas] Resumen calculado: $' + total + ' en ' + cantidad + ' cuotas');

    res.json({
      total_recaudado: total,
      cantidad_cuotas: cantidad,
      promedio_cuota: cantidad > 0 ? total / cantidad : 0,
    });
  } catch (error) {
    console.error('[getResumenCuotas] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};
