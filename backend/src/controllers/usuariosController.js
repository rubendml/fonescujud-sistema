import supabase, { supabaseAdmin } from '../db.js';

// Obtener todos los usuarios/afiliados
export const getUsuarios = async (req, res) => {
  try {
    console.log('[getUsuarios] Iniciando solicitud');
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('[getUsuarios] Supabase error:', error);
      throw error;
    }
    console.log('[getUsuarios] Datos obtenidos:', data.length, 'registros');
    res.json(data);
  } catch (error) {
    console.error('[getUsuarios] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo usuario/afiliado
export const createUsuario = async (req, res) => {
  try {
    const { nombre, cedula, email, telefono, afiliado, cupos_mensuales, valor_cuota, estado } = req.body;
    console.log('[createUsuario] Creando nuevo usuario:', nombre);

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .insert([
        {
          nombre,
          cedula,
          email,
          telefono,
          afiliado: afiliado || false,
          cupos_mensuales: cupos_mensuales || 0,
          valor_cuota: valor_cuota || 200000,
          estado: estado !== undefined ? estado : true,
          fecha_creacion: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('[createUsuario] Supabase error:', error);
      throw error;
    }
    console.log('[createUsuario] Usuario creado exitosamente');
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('[createUsuario] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cedula, email, telefono, afiliado, cupos_mensuales, valor_cuota, estado } = req.body;
    console.log('[updateUsuario] Actualizando usuario:', id);

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .update({
        nombre,
        cedula,
        email,
        telefono,
        afiliado,
        cupos_mensuales,
        valor_cuota,
        estado,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[updateUsuario] Supabase error:', error);
      throw error;
    }
    console.log('[updateUsuario] Usuario actualizado exitosamente');
    res.json(data[0]);
  } catch (error) {
    console.error('[updateUsuario] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[deleteUsuario] Eliminando usuario:', id);

    const { error } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[deleteUsuario] Supabase error:', error);
      throw error;
    }
    console.log('[deleteUsuario] Usuario eliminado exitosamente');
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('[deleteUsuario] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[getUsuarioById] Obteniendo usuario:', id);

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[getUsuarioById] Supabase error:', error);
      throw error;
    }
    console.log('[getUsuarioById] Usuario obtenido exitosamente');
    res.json(data);
  } catch (error) {
    console.error('[getUsuarioById] Error catchado:', error.message);
    res.status(500).json({ error: error.message });
  }
};
