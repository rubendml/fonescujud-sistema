import supabase, { supabaseAdmin } from '../db.js';

// Registrar multa por mora
export const registrarMulta = async (req, res) => {
  try {
    const { usuario_id, motivo, valor, fecha_multa, fecha_pago, estado } = req.body;

    const { data, error } = await supabaseAdmin
      .from('multas')
      .insert([
        {
          usuario_id,
          motivo,
          valor,
          fecha_multa: fecha_multa || new Date().toISOString(),
          fecha_pago,
          estado: estado || (fecha_pago ? 'pagada' : 'pendiente'),
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener multa por ID
export const getMultaById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[getMultaById] Obteniendo multa:', id);

    const { data, error } = await supabaseAdmin
      .from('multas')
      .select('*, usuarios(nombre, cedula)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[getMultaById] Supabase error:', error);
      throw error;
    }
    console.log('[getMultaById] Multa obtenida');
    res.json(data);
  } catch (error) {
    console.error('[getMultaById] Error:', error.message);
    res.status(404).json({ error: 'Multa no encontrada' });
  }
};

// Pagar multa
export const pagarMulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_pago } = req.body;

    const { data, error } = await supabaseAdmin
      .from('multas')
      .update({
        estado: 'pagada',
        fecha_pago: fecha_pago || new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar multa
export const updateMulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, motivo, valor, fecha_multa, fecha_pago, estado } = req.body;

    const { data, error } = await supabaseAdmin
      .from('multas')
      .update({
        usuario_id,
        motivo,
        valor,
        fecha_multa,
        fecha_pago,
        estado,
      })
      .eq('id', id)
      .select('*, usuarios(nombre, cedula)');

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener multas de un usuario
export const getMultasUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    console.log('[getMultasUsuario] Iniciando solicitud para usuario:', usuario_id);

    const { data, error } = await supabaseAdmin
      .from('multas')
      .select('*, usuarios(nombre, cedula)')
      .eq('usuario_id', usuario_id)
      .order('fecha_multa', { ascending: false });

    if (error) {
      console.error('[getMultasUsuario] Supabase error:', error);
      throw error;
    }
    console.log('[getMultasUsuario] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getMultasUsuario] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las multas
export const getAllMultas = async (req, res) => {
  try {
    console.log('[getAllMultas] Iniciando solicitud');
    const { data, error } = await supabaseAdmin
      .from('multas')
      .select('*, usuarios(nombre, cedula)')
      .order('fecha_multa', { ascending: false });

    if (error) {
      console.error('[getAllMultas] Supabase error:', error);
      throw error;
    }
    console.log('[getAllMultas] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getAllMultas] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener resumen de multas
export const getResumenMultas = async (req, res) => {
  try {
    console.log('[getResumenMultas] Iniciando solicitud');
    const { data: multas, error } = await supabaseAdmin
      .from('multas')
      .select('valor, estado');

    if (error) {
      console.error('[getResumenMultas] Supabase error:', error);
      throw error;
    }

    const total_multas = multas.reduce((sum, m) => sum + m.valor, 0);
    const multas_pagadas = multas
      .filter((m) => m.estado === 'pagada')
      .reduce((sum, m) => sum + m.valor, 0);
    const multas_pendientes = multas
      .filter((m) => m.estado === 'pendiente')
      .reduce((sum, m) => sum + m.valor, 0);

    console.log('[getResumenMultas] Resumen calculado');

    res.json({
      total_multas,
      multas_pagadas,
      multas_pendientes,
      cantidad_multas: multas.length,
      cantidad_pagadas: multas.filter((m) => m.estado === 'pagada').length,
      cantidad_pendientes: multas.filter((m) => m.estado === 'pendiente')
        .length,
    });
  } catch (error) {
    console.error('[getResumenMultas] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};
