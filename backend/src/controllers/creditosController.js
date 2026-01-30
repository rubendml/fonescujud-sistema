import supabase, { supabaseAdmin } from '../db.js';
import { calcularInteres } from '../utils/calculos.js';

// Crear nuevo crédito
export const crearCredito = async (req, res) => {
  try {
    const {
      usuario_id,
      monto_original,
      monto_solicitado,
      plazo_meses,
      porcentaje_interes,
      fecha_desembolso,
    } = req.body;

    // Calcular primer mes de interés
    const monto = monto_solicitado || monto_original;
    const interes_primer_mes = calcularInteres(
      monto,
      porcentaje_interes,
      1
    );

    const { data: credito, error: errorCredito } = await supabaseAdmin
      .from('creditos')
      .insert([
        {
          usuario_id,
          monto_original: monto,
          saldo_actual: monto,
          plazo_meses,
          porcentaje_interes,
          fecha_desembolso: fecha_desembolso || new Date().toISOString(),
          estado: 'activo',
          interes_acumulado: interes_primer_mes,
        },
      ])
      .select();

    if (errorCredito) throw errorCredito;

    // Registrar el desembolso
    const { data: desembolso, error: errorDesembolso } = await supabaseAdmin
      .from('movimientos_creditos')
      .insert([
        {
          credito_id: credito[0].id,
          usuario_id,
          tipo_movimiento: 'desembolso',
          monto: monto,
          fecha_movimiento: fecha_desembolso || new Date().toISOString(),
          descripcion: 'Desembolso inicial',
        },
      ])
      .select();

    if (errorDesembolso) throw errorDesembolso;

    // Registrar el interés del primer mes
    const { data: interes, error: errorInteres } = await supabaseAdmin
      .from('movimientos_creditos')
      .insert([
        {
          credito_id: credito[0].id,
          usuario_id,
          tipo_movimiento: 'interes',
          monto: interes_primer_mes,
          fecha_movimiento: fecha_desembolso || new Date().toISOString(),
          descripcion: `Interés primer mes (${porcentaje_interes}%)`,
        },
      ])
      .select();

    if (errorInteres) throw errorInteres;

    res.status(201).json({
      credito: credito[0],
      desembolso: desembolso[0],
      interes: interes[0],
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Registrar abono a crédito
export const registrarAbono = async (req, res) => {
  try {
    let { credito_id, monto, fecha_pago } = req.body;

    // Validar y convertir datos
    if (!credito_id || !monto) {
      throw new Error('credito_id y monto son requeridos');
    }

    // Asegurar que monto es un número válido
    monto = parseFloat(monto);
    if (isNaN(monto) || monto <= 0) {
      throw new Error('El monto debe ser un número positivo válido');
    }

    // Obtener crédito actual con usuario_id
    const { data: credito, error: errorCredito } = await supabaseAdmin
      .from('creditos')
      .select('*, usuarios(id, nombre)')
      .eq('id', credito_id)
      .single();

    if (errorCredito) throw errorCredito;
    if (!credito) throw new Error('Crédito no encontrado');

    console.log(`[registrarAbono] Crédito ID: ${credito_id}, Saldo actual: ${credito.saldo_actual}, Abono: ${monto}`);

    // Actualizar saldo
    const nuevo_saldo = credito.saldo_actual - monto;

    console.log(`[registrarAbono] Nuevo saldo calculado: ${nuevo_saldo}`);

    const { data: actualizacion, error: errorActualizacion } = await supabaseAdmin
      .from('creditos')
      .update({ saldo_actual: nuevo_saldo })
      .eq('id', credito_id)
      .select();

    if (errorActualizacion) throw errorActualizacion;

    console.log(`[registrarAbono] Saldo actualizado en DB: ${actualizacion[0]?.saldo_actual}`);

    // Registrar movimiento de abono
    const { data: abono, error: errorAbono } = await supabaseAdmin
      .from('movimientos_creditos')
      .insert([
        {
          credito_id,
          usuario_id: credito.usuario_id,
          tipo_movimiento: 'abono',
          monto,
          fecha_movimiento: fecha_pago || new Date().toISOString(),
          descripcion: `Abono de $${monto.toLocaleString('es-CO')}`,
        },
      ])
      .select();

    if (errorAbono) throw errorAbono;

    res.json({
      success: true,
      message: 'Abono registrado correctamente',
      credito: actualizacion[0],
      abono: abono[0],
    });
  } catch (error) {
    console.error('[registrarAbono] Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Obtener créditos de un usuario
export const getCreditosUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    console.log('[getCreditosUsuario] Iniciando solicitud para usuario:', usuario_id);

    const { data, error } = await supabaseAdmin
      .from('creditos')
      .select(
        `
        *,
        movimientos_creditos(*)
      `
      )
      .eq('usuario_id', usuario_id)
      .order('fecha_desembolso', { ascending: false });

    if (error) {
      console.error('[getCreditosUsuario] Supabase error:', error);
      throw error;
    }
    console.log('[getCreditosUsuario] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getCreditosUsuario] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los créditos
export const getAllCreditos = async (req, res) => {
  try {
    console.log('[getAllCreditos] Iniciando solicitud');
    const { data, error } = await supabaseAdmin
      .from('creditos')
      .select('*, usuarios(nombre, cedula), movimientos_creditos(*)')
      .order('fecha_desembolso', { ascending: false });

    if (error) {
      console.error('[getAllCreditos] Supabase error:', error);
      throw error;
    }
    console.log('[getAllCreditos] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getAllCreditos] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener resumen de créditos
export const getResumenCreditos = async (req, res) => {
  try {
    console.log('[getResumenCreditos] Iniciando solicitud');
    const { data: creditos, error } = await supabaseAdmin
      .from('creditos')
      .select('monto_original, saldo_actual, interes_acumulado, estado');

    if (error) {
      console.error('[getResumenCreditos] Supabase error:', error);
      throw error;
    }

    const total_desembolsado = creditos.reduce(
      (sum, c) => sum + c.monto_original,
      0
    );
    const total_saldo = creditos.reduce((sum, c) => sum + c.saldo_actual, 0);
    const total_interes = creditos.reduce(
      (sum, c) => sum + c.interes_acumulado,
      0
    );
    const creditos_activos = creditos.filter(
      (c) => c.estado === 'activo'
    ).length;

    console.log('[getResumenCreditos] Resumen calculado');

    res.json({
      total_desembolsado,
      total_saldo_pendiente: total_saldo,
      total_interes_acumulado: total_interes,
      creditos_activos,
      creditos_pagados: creditos.filter((c) => c.estado === 'pagado').length,
    });
  } catch (error) {
    console.error('[getResumenCreditos] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Registrar interés en un crédito
export const registrarInteres = async (req, res) => {
  try {
    const { credito_id, monto, fecha_pago } = req.body;

    // Validar datos
    if (!credito_id || !monto) {
      throw new Error('credito_id y monto son requeridos');
    }

    // Obtener crédito actual con usuario_id
    const { data: credito, error: errorCredito } = await supabaseAdmin
      .from('creditos')
      .select('*, usuarios(id, nombre)')
      .eq('id', credito_id)
      .single();

    if (errorCredito) throw errorCredito;
    if (!credito) throw new Error('Crédito no encontrado');

    // Actualizar tanto el interés acumulado como el interés cobrado
    const nuevo_interes_acumulado = (credito.interes_acumulado || 0) + monto;
    const nuevo_interes_cobrado = (credito.interes_cobrado || 0) + monto;

    const { data: actualizacion, error: errorActualizacion } = await supabaseAdmin
      .from('creditos')
      .update({
        interes_acumulado: nuevo_interes_acumulado,
        interes_cobrado: nuevo_interes_cobrado
      })
      .eq('id', credito_id)
      .select();

    if (errorActualizacion) throw errorActualizacion;

    // Registrar movimiento de interés
    const { data: interes, error: errorInteres } = await supabaseAdmin
      .from('movimientos_creditos')
      .insert([
        {
          credito_id,
          usuario_id: credito.usuario_id,
          tipo_movimiento: 'interes',
          monto,
          fecha_movimiento: fecha_pago || new Date().toISOString(),
          descripcion: `Interés de $${monto.toLocaleString('es-CO')}`,
        },
      ])
      .select();

    if (errorInteres) throw errorInteres;

    res.json({
      success: true,
      message: 'Interés registrado correctamente',
      credito: actualizacion[0],
      interes: interes[0],
    });
  } catch (error) {
    console.error('[registrarInteres] Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Finalizar crédito (saldar/cancelar)
export const finalizarCredito = async (req, res) => {
  try {
    const { credito_id, estado_final = 'pagado' } = req.body;
    if (!credito_id) throw new Error('credito_id es requerido');
    if (!['pagado', 'cancelado', 'saldado'].includes(estado_final)) throw new Error('Estado final inválido');

    // Obtener crédito
    const { data: credito, error: errorCredito } = await supabaseAdmin
      .from('creditos')
      .select('*')
      .eq('id', credito_id)
      .single();
    if (errorCredito) throw errorCredito;
    if (!credito) throw new Error('Crédito no encontrado');

    // Actualizar saldo a 0 y estado
    const { data: actualizacion, error: errorActualizacion } = await supabaseAdmin
      .from('creditos')
      .update({ saldo_actual: 0, estado: estado_final })
      .eq('id', credito_id)
      .select();
    if (errorActualizacion) throw errorActualizacion;

    // Registrar movimiento de cierre
    await supabaseAdmin.from('movimientos_creditos').insert([
      {
        credito_id,
        usuario_id: credito.usuario_id,
        tipo_movimiento: 'finalizacion',
        monto: credito.saldo_actual,
        fecha_movimiento: new Date().toISOString(),
        descripcion: `Crédito ${estado_final === 'pagado' ? 'saldado' : 'cancelado'} por el administrador.`
      }
    ]);

    res.json({
      success: true,
      message: `Crédito marcado como ${estado_final}`,
      credito: actualizacion[0]
    });
  } catch (error) {
    console.error('[finalizarCredito] Error:', error.message);
    res.status(400).json({ error: error.message });
  }
};