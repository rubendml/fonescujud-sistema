// API Configuration viene de config.js cargado en el HTML
// const API_BASE_URL ya está definido globalmente

// State for editing
let currentEditingId = null;
let currentEditingType = null;

// Utility Functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || 'development-token';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

// Modal Management
const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'flex';
};

const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
};

// Close modals on background click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Toast notification
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// Almacenar usuarios para usar en dropdowns
let usuariosCache = [];

// Cargar usuarios en los dropdowns
const loadUsuariosInSelects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    const usuarios = await response.json();
    usuariosCache = usuarios;

    // Llenar los tres selects de usuarios
    const selects = ['cuotaUsuario', 'creditoUsuario', 'multaUsuario'];
    selects.forEach(selectId => {
      const select = document.getElementById(selectId);
      if (select) {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Seleccionar usuario</option>';
        usuarios.forEach(u => {
          const option = document.createElement('option');
          option.value = u.id;
          option.textContent = `${u.nombre} (${u.cedula})`;
          select.appendChild(option);
        });
        if (currentValue) select.value = currentValue;
      }
    });
  } catch (error) {
    console.error('Error loading usuarios:', error);
  }
};

// Dashboard Data Fetch
const fetchDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Error fetching data');
    const data = await response.json();
    updateDashboard(data);
  } catch (error) {
    console.error('Error:', error);
    updateDashboardError();
  }
};

const updateDashboard = (data) => {
  if (!data || !data.totales) return;
  const { totales, resumen } = data;

  // Top stat cards
  const totalAfiliados = document.getElementById('totalAfiliados');
  const totalCuotas = document.getElementById('totalCuotas');
  const totalCreditos = document.getElementById('totalCreditos');
  const totalPorCobrar = document.getElementById('totalPorCobrar');
  if (totalAfiliados) totalAfiliados.textContent = resumen?.usuarios_afiliados || 0;
  if (totalCuotas) totalCuotas.textContent = formatCurrency(totales.cuotas || 0);
  if (totalCreditos) totalCreditos.textContent = formatCurrency(totales.creditos || 0);
  if (totalPorCobrar) totalPorCobrar.textContent = formatCurrency(totales.multas || 0);

  // Cuotas detail
  const cuotasTotal = document.getElementById('cuotasTotal');
  const cuotasCantidad = document.getElementById('cuotasCantidad');
  if (cuotasTotal) cuotasTotal.textContent = formatCurrency(totales.cuotas || 0);
  if (cuotasCantidad) cuotasCantidad.textContent = resumen?.usuarios_afiliados || 0;

  // Créditos detail
  const creditoTotal = document.getElementById('creditoTotal');
  const creditoSaldo = document.getElementById('creditoSaldo');
  const creditoInteres = document.getElementById('creditoInteres');
  const creditosActivos = document.getElementById('creditosActivos');
  if (creditoTotal) creditoTotal.textContent = formatCurrency(totales.creditos || 0);
  if (creditoSaldo) creditoSaldo.textContent = formatCurrency(resumen?.saldo_pendiente || 0);
  if (creditoInteres) creditoInteres.textContent = formatCurrency(totales.interes_recaudado || 0);
  if (creditosActivos) creditosActivos.textContent = resumen?.creditos_activos || 0;

  // Multas detail
  const multasTotal = document.getElementById('multasTotal');
  const multasRecaudadas = document.getElementById('multasRecaudadas');
  const multasPendientes = document.getElementById('multasPendientes');
  const totalMultas = (totales.multas || 0) + (resumen?.multas_pendientes || 0);
  if (multasTotal) multasTotal.textContent = formatCurrency(totalMultas);
  if (multasRecaudadas) multasRecaudadas.textContent = formatCurrency(totales.multas || 0);
  if (multasPendientes) multasPendientes.textContent = formatCurrency(resumen?.multas_pendientes || 0);

  // Financial summary section
  const ingresosTotal = document.getElementById('ingresosTotal');
  const ingresoCuotas = document.getElementById('ingresoCuotas');
  const ingresoInteres = document.getElementById('ingresoInteres');
  const ingresoMultas = document.getElementById('ingresoMultas');
  const fondosPrestamos = document.getElementById('fondosPrestamos');
  const porCobrarTotal = document.getElementById('porCobrarTotal');
  const porCobrarSaldos = document.getElementById('porCobrarSaldos');
  const porCobrarMultas = document.getElementById('porCobrarMultas');
  if (ingresosTotal) ingresosTotal.textContent = formatCurrency(totales.ingresos || 0);
  if (ingresoCuotas) ingresoCuotas.textContent = formatCurrency(totales.cuotas || 0);
  if (ingresoInteres) ingresoInteres.textContent = formatCurrency(totales.interes_recaudado || 0);
  if (ingresoMultas) ingresoMultas.textContent = formatCurrency(totales.multas || 0);
  if (fondosPrestamos) fondosPrestamos.textContent = formatCurrency(totales.creditos || 0);
  if (porCobrarTotal) porCobrarTotal.textContent = formatCurrency((resumen?.saldo_pendiente || 0) + (totales.multas || 0));
  if (porCobrarSaldos) porCobrarSaldos.textContent = formatCurrency(resumen?.saldo_pendiente || 0);
  if (porCobrarMultas) porCobrarMultas.textContent = formatCurrency(totales.multas || 0);

  // Info cards at bottom
  const afiliados = document.getElementById('afiliados');
  const noAfiliados = document.getElementById('noAfiliados');
  if (afiliados) afiliados.textContent = resumen?.usuarios_afiliados || 0;
  if (noAfiliados) noAfiliados.textContent = resumen?.usuarios_no_afiliados || 0;
};

const updateDashboardError = () => {
  const cards = ['dashIngresosTotales', 'dashCuotasTotal', 'dashCreditos', 'dashMultas'];
  cards.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '$0';
  });
};

// Fetch Usuarios
const fetchUsuarios = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    if (!response.ok) throw new Error('Error fetching usuarios');
    const usuarios = await response.json();
    displayUsuarios(usuarios);
  } catch (error) {
    console.error('Error:', error);
    displayError('usuarios');
  }
};

const displayUsuarios = (usuarios) => {
  const tbody = document.querySelector('#usuariosTable');
  if (!tbody) return;

  tbody.innerHTML = usuarios.map(u => `
    <tr>
      <td>${u.nombre}</td>
      <td>${u.cedula}</td>
      <td>${u.email}</td>
      <td>${u.afiliado ? 'Sí' : 'No'}</td>
      <td>${formatCurrency(u.valor_cuota || 0)}</td>
      <td><span class="badge ${u.estado ? 'badge-success' : 'badge-danger'}">${u.estado ? 'Activo' : 'Inactivo'}</span></td>
      <td>
        <button class="btn-small btn-edit" onclick="editUsuario(${u.id})">Editar</button>
        <button class="btn-small btn-danger" onclick="deleteUsuario(${u.id})">Eliminar</button>
      </td>
    </tr>
  `).join('');
};

const editUsuario = (id) => {
  currentEditingId = id;
  currentEditingType = 'usuario';

  // Buscar usuario en la tabla
  const rows = document.querySelectorAll('#usuariosTable tr');
  for (let row of rows) {
    const btn = row.querySelector(`button[onclick="editUsuario(${id})"]`);
    if (btn) {
      const cells = row.cells;
      document.getElementById('usuarioNombre').value = cells[0].textContent;
      document.getElementById('usuarioCedula').value = cells[1].textContent;
      document.getElementById('usuarioEmail').value = cells[2].textContent;
      document.getElementById('usuarioAfiliado').value = cells[3].textContent === 'Sí' ? '1' : '0';
      document.getElementById('usuarioCuota').value = cells[4].textContent.replace(/[^\d]/g, '');
      break;
    }
  }
  openModal('usuarioModal');
};

const deleteUsuario = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (response.ok) {
      showToast('Usuario eliminado correctamente', 'success');
      fetchUsuarios();
    } else {
      showToast('Error al eliminar usuario', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al eliminar usuario', 'error');
  }
};

// Fetch Cuotas
const fetchCuotas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cuotas`);
    if (!response.ok) throw new Error('Error fetching cuotas');
    const cuotas = await response.json();
    displayCuotas(cuotas);
  } catch (error) {
    console.error('Error:', error);
    displayError('cuotas');
  }
};

const displayCuotas = (cuotas) => {
  const tbody = document.querySelector('#cuotasTable');
  if (!tbody) return;

  tbody.innerHTML = cuotas.map(c => `
    <tr>
      <td>${c.usuarios?.nombre || 'N/A'}</td>
      <td>${c.mes}/${c.anio}</td>
      <td>${formatCurrency(c.valor_pagado)}</td>
      <td>${new Date(c.fecha_pago).toLocaleDateString('es-CO')}</td>
      <td><span class="badge badge-success">${c.estado}</span></td>
      <td>
        <button class="btn-small btn-edit" onclick="editCuota(${c.id})">Editar</button>
      </td>
    </tr>
  `).join('');
};

const editCuota = (id) => {
  currentEditingId = id;
  currentEditingType = 'cuota';
  openModal('cuotaModal');
};

// Fetch Créditos
const fetchCreditos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/creditos`);
    if (!response.ok) throw new Error('Error fetching creditos');
    const creditos = await response.json();
    displayCreditos(creditos);
  } catch (error) {
    console.error('Error:', error);
    displayError('creditos');
  }
};

const displayCreditos = (creditos) => {
  const tbody = document.querySelector('#creditosTable');
  if (!tbody) return;

  if (creditos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No hay créditos registrados</td></tr>';
    return;
  }

  tbody.innerHTML = creditos.map(c => {
    const usuarioNombre = c.usuarios?.nombre || `Usuario ${c.usuario_id}`;
    return `
      <tr>
        <td>${usuarioNombre}</td>
        <td>${formatCurrency(c.monto_original)}</td>
        <td>${formatCurrency(c.saldo_actual)}</td>
        <td>${c.plazo_meses} meses</td>
        <td>${c.porcentaje_interes}%</td>
        <td><span class="badge ${c.estado === 'activo' ? 'badge-success' : 'badge-danger'}">${c.estado}</span></td>
        <td>
          <button class="btn-small btn-info" onclick="abonarCredito(${c.id})">Abonar</button>
          <button class="btn-small btn-warning" onclick="registrarInteres(${c.id})">Intereses</button>
          <button class="btn-small btn-success" onclick="finalizarCredito(${c.id})">Finalizar</button>
        </td>
      </tr>
    `;
  }).join('');
};

const abonarCredito = (id) => {
  const monto = prompt('Ingresa el monto del abono:');
  if (monto && !isNaN(monto) && parseFloat(monto) > 0) {
    registrarAbono(id, parseFloat(monto));
  } else if (monto) {
    showToast('Monto inválido', 'error');
  }
};

const registrarAbono = async (creditoId, monto) => {
  try {
    console.log('[registrarAbono] Enviando:', { credito_id: creditoId, monto });
    const response = await fetch(`${API_BASE_URL}/creditos/abono`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ credito_id: creditoId, monto })
    });

    const data = await response.json();
    console.log('[registrarAbono] Respuesta:', data);

    if (response.ok) {
      showToast(`Abono de $${monto.toLocaleString('es-CO')} registrado`, 'success');
      // Recargar créditos después de un pequeño delay para asegurar sincronización
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchCreditos();
      // Actualizar también el dashboard
      await fetchDashboardData();
    } else {
      showToast(`Error: ${data.error || 'No se pudo registrar el abono'}`, 'error');
    }
  } catch (error) {
    console.error('[registrarAbono] Error:', error);
    showToast('Error al registrar abono: ' + error.message, 'error');
  }
};

const registrarInteres = (id) => {
  const monto = prompt('Ingresa el monto del interés:');
  if (monto && !isNaN(monto) && parseFloat(monto) > 0) {
    crearRegistroInteres(id, parseFloat(monto));
  } else if (monto) {
    showToast('Monto inválido', 'error');
  }
};

const crearRegistroInteres = async (creditoId, monto) => {
  try {
    console.log('[crearRegistroInteres] Enviando:', { credito_id: creditoId, monto });
    const response = await fetch(`${API_BASE_URL}/creditos/interes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ credito_id: creditoId, monto })
    });

    const data = await response.json();
    console.log('[crearRegistroInteres] Respuesta:', data);

    if (response.ok) {
      showToast(`Interés de $${monto.toLocaleString('es-CO')} registrado`, 'success');
      // Recargar créditos después de un pequeño delay para asegurar sincronización
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchCreditos();
      // Actualizar también el dashboard
      await fetchDashboardData();
    } else {
      showToast(`Error: ${data.error || 'No se pudo registrar el interés'}`, 'error');
    }
  } catch (error) {
    console.error('[crearRegistroInteres] Error:', error);
    showToast('Error al registrar interés: ' + error.message, 'error');
  }
};


const finalizarCredito = async (id) => {
  if (confirm('¿Estás seguro de que deseas finalizar este crédito?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/creditos/finalizar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ credito_id: id, estado_final: 'pagado' })
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Crédito finalizado correctamente', 'success');
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchCreditos();
        await fetchDashboardData();
      } else {
        showToast('Error: ' + (data.error || 'No se pudo finalizar el crédito'), 'error');
      }
    } catch (error) {
      console.error('[finalizarCredito] Error:', error);
      showToast('Error al finalizar crédito: ' + error.message, 'error');
    }
  }
};

const editCredito = (id) => {
  currentEditingId = id;
  currentEditingType = 'credito';
  openModal('creditoModal');
};

// Fetch Multas
const fetchMultas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/multas`);
    if (!response.ok) throw new Error('Error fetching multas');
    const multas = await response.json();
    displayMultas(multas);
  } catch (error) {
    console.error('Error:', error);
    displayError('multas');
  }
};

const displayMultas = (multas) => {
  const tbody = document.querySelector('#multasTable');
  if (!tbody) return;

  if (multas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No hay multas registradas</td></tr>';
    return;
  }

  tbody.innerHTML = multas.map(m => {
    const usuarioNombre = m.usuarios?.nombre || `Usuario ${m.usuario_id}`;
    return `
    <tr>
      <td>${usuarioNombre}</td>
      <td>${m.motivo}</td>
      <td>${formatCurrency(m.valor)}</td>
      <td>${new Date(m.fecha_multa).toLocaleDateString('es-CO')}</td>
      <td><span class="badge ${m.estado === 'pagada' ? 'badge-success' : 'badge-danger'}">${m.estado}</span></td>
      <td>
        <button class="btn-small btn-edit" onclick="editMulta(${m.id})">Editar</button>
      </td>
    </tr>
  `;
  }).join('');
};

const editMulta = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/multas/${id}`);
    if (!response.ok) throw new Error('Error cargando multa');
    const multa = await response.json();

    currentEditingId = id;
    currentEditingType = 'multa';

    // Llenar los datos en el modal
    const usuarioSelect = document.getElementById('multaUsuario');
    // Asegurar que el select tenga las opciones cargadas antes de fijar el valor
    await loadUsuariosInSelects();
    usuarioSelect.value = multa.usuario_id;
    usuarioSelect.disabled = true; // Deshabilitar cambio de usuario

    document.getElementById('multaMotivo').value = multa.motivo;
    document.getElementById('multaValor').value = multa.valor;
    document.getElementById('multaFecha').value = multa.fecha_multa.split('T')[0];
    document.getElementById('multaEstado').value = multa.estado;

    // Cambiar título del modal
    document.querySelector('#multaModal h2').textContent = `Editar Multa - ${multa.usuarios?.nombre || 'Usuario desconocido'}`;

    openModal('multaModal');
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error al cargar la multa', 'error');
  }
};

// Fetch Movimientos
const fetchMovimientos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movimientos`);
    if (!response.ok) throw new Error('Error fetching movimientos');
    const movimientos = await response.json();
    displayMovimientos(movimientos);
  } catch (error) {
    console.error('Error:', error);
    displayError('movimientos');
  }
};

const displayMovimientos = (movimientos) => {
  const tbody = document.querySelector('#movimientosTable');
  if (!tbody) return;

  const filterValue = document.getElementById('movimientosFilter')?.value || '';

  const filtered = filterValue
    ? movimientos.filter(m => m.tipo_movimiento === filterValue)
    : movimientos;

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No hay movimientos para mostrar</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    const usuario = m.usuarios?.nombre || 'Desconocido';
    const fecha = new Date(m.fecha_movimiento).toLocaleDateString('es-CO');
    const tipo = m.tipo_movimiento.charAt(0).toUpperCase() + m.tipo_movimiento.slice(1);

    let tipoBadge = 'badge-info';
    if (m.tipo_movimiento === 'desembolso') tipoBadge = 'badge-primary';
    if (m.tipo_movimiento === 'abono') tipoBadge = 'badge-success';
    if (m.tipo_movimiento === 'interes') tipoBadge = 'badge-warning';

    return `
      <tr>
        <td>#${m.credito_id}</td>
        <td>${usuario}</td>
        <td><span class="badge ${tipoBadge}">${tipo}</span></td>
        <td>${formatCurrency(m.monto)}</td>
        <td>${fecha}</td>
        <td>${m.descripcion || '-'}</td>
      </tr>
    `;
  }).join('');
};

// Fetch Reportes
const fetchReportes = async () => {
  try {
    // Obtener datos de dashboard
    const dashResponse = await fetch(`${API_BASE_URL}/dashboard`);
    if (!dashResponse.ok) throw new Error('Error fetching dashboard');
    const dashData = await dashResponse.json();

    // Obtener datos de movimientos
    const movResponse = await fetch(`${API_BASE_URL}/movimientos/resumen`);
    if (!movResponse.ok) throw new Error('Error fetching movimientos resumen');
    const movData = await movResponse.json();

    displayReportes(dashData, movData);
  } catch (error) {
    console.error('Error:', error);
  }
};

const displayReportes = (dashData, movData) => {
  // Actualizar resumen de créditos
  const resumen = dashData.resumen || {};

  const reportTotalDesembolsado = document.getElementById('reportTotalDesembolsado');
  const reportSaldoPendiente = document.getElementById('reportSaldoPendiente');
  const reportInteresAcumulado = document.getElementById('reportInteresAcumulado');
  const reportCreditosActivos = document.getElementById('reportCreditosActivos');
  const reportCreditosPagados = document.getElementById('reportCreditosPagados');
  const reportTotalCreditos = document.getElementById('reportTotalCreditos');

  if (reportTotalDesembolsado) reportTotalDesembolsado.textContent = formatCurrency(resumen.total_desembolsado || 0);
  if (reportSaldoPendiente) reportSaldoPendiente.textContent = formatCurrency(resumen.saldo_pendiente || 0);
  if (reportInteresAcumulado) reportInteresAcumulado.textContent = formatCurrency(resumen.interes_recaudado || 0);
  if (reportCreditosActivos) reportCreditosActivos.textContent = resumen.creditos_activos || 0;
  if (reportCreditosPagados) reportCreditosPagados.textContent = resumen.creditos_pagados || 0;
  if (reportTotalCreditos) reportTotalCreditos.textContent = resumen.total_creditos || 0;

  // Actualizar resumen de movimientos
  const reportTotalDesembolsos = document.getElementById('reportTotalDesembolsos');
  const reportTotalAbonos = document.getElementById('reportTotalAbonos');
  const reportTotalIntereses = document.getElementById('reportTotalIntereses');
  const reportMontoDesembolsado = document.getElementById('reportMontoDesembolsado');
  const reportMontoAbonado = document.getElementById('reportMontoAbonado');
  const reportMontoInteres = document.getElementById('reportMontoInteres');

  if (reportTotalDesembolsos) reportTotalDesembolsos.textContent = movData.desembolsos || 0;
  if (reportTotalAbonos) reportTotalAbonos.textContent = movData.abonos || 0;
  if (reportTotalIntereses) reportTotalIntereses.textContent = movData.intereses || 0;
  if (reportMontoDesembolsado) reportMontoDesembolsado.textContent = formatCurrency(movData.monto_total_desembolsado || 0);
  if (reportMontoAbonado) reportMontoAbonado.textContent = formatCurrency(movData.monto_total_abonado || 0);
  if (reportMontoInteres) reportMontoInteres.textContent = formatCurrency(movData.monto_total_interes || 0);
};

const displayError = (section) => {
  const tableId = `${section}Table`;
  const table = document.querySelector(`#${tableId}`);
  if (table) {
    const tbody = table.querySelector('tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:red;">Error cargando datos</td></tr>';
  }
};

// ========== FORM SUBMISSIONS ==========

// Nuevo/Editar Usuario
document.getElementById('usuarioForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    nombre: document.getElementById('usuarioNombre').value,
    cedula: document.getElementById('usuarioCedula').value,
    email: document.getElementById('usuarioEmail').value,
    afiliado: document.getElementById('usuarioAfiliado').value === '1',
    valor_cuota: parseInt(document.getElementById('usuarioCuota').value) || 0,
    estado: true
  };

  try {
    let response;
    if (currentEditingId) {
      response = await fetch(`${API_BASE_URL}/usuarios/${currentEditingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
    } else {
      response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
    }

    if (response.ok) {
      showToast(currentEditingId ? 'Usuario actualizado' : 'Usuario creado', 'success');
      closeModal('usuarioModal');
      currentEditingId = null;
      document.getElementById('usuarioForm').reset();
      fetchUsuarios();
    } else {
      const error = await response.json();
      showToast('Error: ' + (error.error || 'Error al guardar usuario'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al guardar usuario', 'error');
  }
});

// Registrar/Editar Cuota
document.getElementById('cuotaForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    usuario_id: parseInt(document.getElementById('cuotaUsuario').value),
    mes: parseInt(document.getElementById('cuotaMes').value),
    anio: parseInt(document.getElementById('cuotaAnio').value),
    valor_pagado: parseInt(document.getElementById('cuotaValor').value) || 0,
    fecha_pago: document.getElementById('cuotaFecha').value,
    estado: 'pagada'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/cuotas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showToast('Cuota registrada', 'success');
      closeModal('cuotaModal');
      document.getElementById('cuotaForm').reset();
      fetchCuotas();
    } else {
      const error = await response.json();
      showToast('Error: ' + (error.error || 'Error al registrar cuota'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al registrar cuota', 'error');
  }
});

// Nuevo/Editar Crédito
document.getElementById('creditoForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuarioId = parseInt(document.getElementById('creditoUsuario').value);
  const monto = parseInt(document.getElementById('creditoMonto').value) || 0;
  const plazo = parseInt(document.getElementById('creditoPlazo').value) || 0;
  const interes = parseFloat(document.getElementById('creditoInteres').value) || 0;
  const fecha = document.getElementById('creditoFecha').value;

  // Validar que todos los datos estén presentes
  if (!usuarioId || !monto || !plazo || !interes || !fecha) {
    showToast('Por favor completa todos los campos', 'error');
    return;
  }

  const formData = {
    usuario_id: usuarioId,
    monto_original: monto,
    monto_solicitado: monto,
    plazo_meses: plazo,
    porcentaje_interes: interes,
    fecha_desembolso: fecha,
    estado: 'activo'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/creditos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showToast('Crédito registrado correctamente', 'success');
      closeModal('creditoModal');
      currentEditingId = null;
      document.getElementById('creditoForm').reset();
      fetchCreditos();
    } else {
      const error = await response.json();
      showToast('Error: ' + (error.error || 'Error al guardar crédito'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al guardar crédito', 'error');
  }
});

// Nueva/Editar Multa
document.getElementById('multaForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    usuario_id: parseInt(document.getElementById('multaUsuario').value),
    motivo: document.getElementById('multaMotivo').value,
    valor: parseInt(document.getElementById('multaValor').value) || 0,
    fecha_multa: document.getElementById('multaFecha').value,
    estado: document.getElementById('multaEstado').value
  };

  try {
    let response;

    if (currentEditingId) {
      // Editar multa existente
      response = await fetch(`${API_BASE_URL}/multas/${currentEditingId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
    } else {
      // Crear nueva multa
      response = await fetch(`${API_BASE_URL}/multas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
    }

    if (response.ok) {
      showToast(currentEditingId ? 'Multa actualizada' : 'Multa creada', 'success');
      closeModal('multaModal');
      currentEditingId = null;
      document.querySelector('#multaModal h2').textContent = 'Nueva Multa';
      document.getElementById('multaForm').reset();
      fetchMultas();
      // Recargar dashboard para reflejar cambios
      fetchDashboardData();
    } else {
      const error = await response.json();
      showToast('Error: ' + (error.error || 'Error al guardar multa'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al guardar multa', 'error');
  }
});
// Navigation setup
const setupNavigation = () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.getAttribute('data-section');

      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));

      const sectionEl = document.getElementById(`${section}-section`);
      if (sectionEl) {
        sectionEl.classList.add('active');

        if (section === 'usuarios') fetchUsuarios();
        if (section === 'cuotas') fetchCuotas();
        if (section === 'creditos') fetchCreditos();
        if (section === 'movimientos') fetchMovimientos();
        if (section === 'multas') fetchMultas();
        if (section === 'reportes') fetchReportes();
      }

      const titles = {
        dashboard: 'Dashboard',
        usuarios: 'Usuarios',
        cuotas: 'Cuotas',
        creditos: 'Créditos',
        movimientos: 'Movimientos de Créditos',
        multas: 'Multas',
        reportes: 'Reportes'
      };
      const titleEl = document.getElementById('sectionTitle');
      if (titleEl) titleEl.textContent = titles[section] || 'Dashboard';
    });
  });

  // Logout button
  document.querySelector('.logout-btn')?.addEventListener('click', () => {
    alert('Sesión cerrada');
    window.location.href = '../public/';
  });
};

// Botones de creación
document.getElementById('btnNuevoUsuario')?.addEventListener('click', () => {
  currentEditingId = null;
  document.getElementById('usuarioForm').reset();
  openModal('usuarioModal');
});

document.getElementById('btnNuevaCuota')?.addEventListener('click', () => {
  currentEditingId = null;
  document.getElementById('cuotaForm').reset();
  loadUsuariosInSelects();
  openModal('cuotaModal');
});

document.getElementById('btnNuevoCredito')?.addEventListener('click', () => {
  currentEditingId = null;
  document.getElementById('creditoForm').reset();
  loadUsuariosInSelects();
  openModal('creditoModal');
});

document.getElementById('btnNuevaMulta')?.addEventListener('click', () => {
  currentEditingId = null;
  document.querySelector('#multaModal h2').textContent = 'Nueva Multa';
  const usuarioSelect = document.getElementById('multaUsuario');
  usuarioSelect.disabled = false; // Habilitar para nueva multa
  usuarioSelect.value = '';
  document.getElementById('multaForm').reset();
  loadUsuariosInSelects();
  openModal('multaModal');
});

// Botones de cerrar modal
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) modal.style.display = 'none';
  });
});

// Filtro de movimientos
document.getElementById('movimientosFilter')?.addEventListener('change', () => {
  fetchMovimientos();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Admin panel loaded');
  setupNavigation();
  fetchDashboardData();
  fetchReportes();
  setInterval(() => {
    fetchDashboardData();
    fetchReportes();
  }, 300000);
});
