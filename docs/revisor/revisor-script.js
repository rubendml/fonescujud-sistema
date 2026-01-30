// API Configuration viene de config.js cargado en el HTML
// const API_BASE_URL ya está definido globalmente

// Utility Functions
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No hay token de autenticación');
    window.location.href = '../login.html';
    return {};
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Manejar errores de autenticación
const handleAuthError = (response) => {
  if (response.status === 401) {
    console.error('Token expirado o inválido');
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    window.location.href = '../login.html';
    return true;
  }
  return false;
};

// Fetch con manejo de autenticación
const authFetch = async (url, options = {}) => {
  const headers = getAuthHeaders();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  if (handleAuthError(response)) {
    throw new Error('Unauthorized');
  }

  return response;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

// Dashboard Data Fetch
const fetchDashboardData = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Error fetching data');
    const data = await response.json();
    updateDashboard(data);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    updateDashboardError();
  }
};

const updateDashboard = (data) => {
  if (!data || !data.totales) {
    console.warn('No data to update dashboard:', data);
    return;
  }

  const { totales, resumen } = data;

  // Update stat cards with correct IDs
  const dashIngresosTotales = document.getElementById('dashIngresosTotales');
  const dashCuotasTotal = document.getElementById('dashCuotasTotal');
  const dashCreditos = document.getElementById('dashCreditos');
  const dashMultas = document.getElementById('dashMultas');

  if (dashIngresosTotales) dashIngresosTotales.textContent = formatCurrency(totales.ingresos || 0);
  if (dashCuotasTotal) dashCuotasTotal.textContent = formatCurrency(totales.cuotas || 0);
  if (dashCreditos) dashCreditos.textContent = formatCurrency(totales.creditos || 0);
  if (dashMultas) dashMultas.textContent = formatCurrency(resumen?.multas_pendientes || 0);

  // Update fund info
  const dashAfiliados = document.getElementById('dashAfiliados');
  const dashNoAfiliados = document.getElementById('dashNoAfiliados');
  const dashCreditosActivos = document.getElementById('dashCreditosActivos');
  const dashPorCobrar = document.getElementById('dashPorCobrar');

  if (dashAfiliados) dashAfiliados.textContent = resumen?.usuarios_afiliados || 0;
  if (dashNoAfiliados) dashNoAfiliados.textContent = resumen?.usuarios_no_afiliados || 0;
  if (dashCreditosActivos) dashCreditosActivos.textContent = resumen?.creditos_activos || 0;
  if (dashPorCobrar) dashPorCobrar.textContent = formatCurrency((resumen?.saldo_pendiente || 0) + (resumen?.multas_pendientes || 0));
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
    const response = await authFetch(`${API_BASE_URL}/usuarios`);
    if (!response.ok) throw new Error('Error fetching usuarios');
    const usuarios = await response.json();
    displayUsuarios(usuarios);
  } catch (error) {
    console.error('Error:', error);
    displayError('usuarios');
  }
};

const displayUsuarios = (usuarios, filter = '') => {
  const tbody = document.querySelector('#usuariosTable');
  if (!tbody) return;

  // Guardar en cache
  usuariosCache = usuarios;

  // Filtrar por nombre si hay búsqueda
  let filtered = usuarios;
  if (filter.trim()) {
    const searchLower = filter.toLowerCase().trim();
    filtered = usuarios.filter(u =>
      u.nombre.toLowerCase().includes(searchLower) ||
      u.cedula.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No se encontraron usuarios</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td>${u.nombre}</td>
      <td>${u.cedula}</td>
      <td>${u.email}</td>
      <td>${u.afiliado ? 'Sí' : 'No'}</td>
      <td>${formatCurrency(u.valor_cuota || 0)}</td>
      <td><span class="badge ${u.estado ? 'badge-success' : 'badge-danger'}">${u.estado ? 'Activo' : 'Inactivo'}</span></td>
    </tr>
  `).join('');
};

// Fetch Cuotas
const fetchCuotas = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/cuotas`);
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
    </tr>
  `).join('');
};

// Fetch Créditos
const fetchCreditos = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/creditos`);
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

  tbody.innerHTML = creditos.map(c => `
    <tr>
      <td>${c.usuarios?.nombre || 'N/A'}</td>
      <td>${formatCurrency(c.monto_original)}</td>
      <td>${formatCurrency(c.saldo_actual)}</td>
      <td>${c.plazo_meses} meses</td>
      <td>${c.porcentaje_interes}%</td>
      <td><span class="badge ${c.estado === 'activo' ? 'badge-success' : 'badge-danger'}">${c.estado}</span></td>
    </tr>
  `).join('');
};

// Búsqueda de Crédito por Cédula
const buscarCreditoPorCedula = async (cedula) => {
  if (!cedula || cedula.trim() === '') {
    alert('Por favor ingresa una cédula');
    return;
  }

  try {
    // Buscar usuario con esa cédula
    const usuariosResponse = await authFetch(`${API_BASE_URL}/usuarios`);
    if (!usuariosResponse.ok) throw new Error('Error al buscar usuarios');
    const usuarios = await usuariosResponse.json();

    const usuario = usuarios.find(u => u.cedula === cedula.trim());
    if (!usuario) {
      alert('No se encontró usuario con esa cédula');
      return;
    }

    // Buscar créditos del usuario
    const creditosResponse = await authFetch(`${API_BASE_URL}/creditos/usuario/${usuario.id}`);
    if (!creditosResponse.ok) throw new Error('Error al buscar créditos');
    const creditos = await creditosResponse.json();

    if (!creditos || creditos.length === 0) {
      alert('Este usuario no tiene créditos registrados');
      return;
    }

    // Buscar el crédito más reciente o activo
    let creditoSeleccionado = creditos.find(c => c.estado === 'activo') || creditos[0];

    // Mostrar el detalle del crédito
    mostrarDetalleCreditoModal(creditoSeleccionado, usuario);
  } catch (error) {
    console.error('Error al buscar crédito:', error);
    alert('Error al buscar crédito: ' + error.message);
  }
};

const mostrarDetalleCreditoModal = (credito, usuario) => {
  // Información del usuario
  const nombreEl = document.getElementById('creditoDetalleNombre');
  const cedulaEl = document.getElementById('creditoDetalleCedula');
  const emailEl = document.getElementById('creditoDetalleEmail');
  const telefonoEl = document.getElementById('creditoDetalleTelefono');
  if (nombreEl) nombreEl.textContent = usuario.nombre;
  if (cedulaEl) cedulaEl.textContent = usuario.cedula;
  if (emailEl) emailEl.textContent = usuario.email;
  if (telefonoEl) telefonoEl.textContent = usuario.telefono || 'N/A';

  // Información del crédito
  const montoEl = document.getElementById('creditoDetalleMonto');
  const saldoEl = document.getElementById('creditoDetalleSaldo');
  const fechaEl = document.getElementById('creditoDetalleFechaDesembolso');
  const plazoEl = document.getElementById('creditoDetallePlazo');
  const tasaEl = document.getElementById('creditoDetalleTasa');
  const estadoEl = document.getElementById('creditoDetalleEstado');
  if (montoEl) montoEl.textContent = formatCurrency(credito.monto_original);
  if (saldoEl) saldoEl.textContent = formatCurrency(credito.saldo_actual);
  if (fechaEl) fechaEl.textContent = new Date(credito.fecha_desembolso).toLocaleDateString('es-CO');
  if (plazoEl) plazoEl.textContent = credito.plazo_meses;
  if (tasaEl) tasaEl.textContent = credito.porcentaje_interes;
  if (estadoEl) {
    estadoEl.innerHTML = `<span class="badge ${credito.estado === 'activo' ? 'badge-success' : credito.estado === 'pagado' ? 'badge-info' : 'badge-danger'}">${credito.estado.toUpperCase()}</span>`;
  }
  const interesCobEl = document.getElementById('creditoDetalleInteresCobrado');
  if (interesCobEl) interesCobEl.textContent = formatCurrency(credito.interes_cobrado || 0);

  // Cambiar título del modal
  document.getElementById('creditoDetalleTitulo').textContent = `Detalle de Crédito - ${usuario.nombre}`;

  // Abrir el modal
  document.getElementById('creditoDetalleModal').style.display = 'flex';
};

const getTipoBadgeColor = (tipo) => {
  switch (tipo) {
    case 'desembolso': return '#094a5e';
    case 'abono': return '#27ae60';
    case 'interes': return '#f39c12';
    case 'ajuste': return '#9b59b6';
    default: return '#7f8c8d';
  }
};

// Fetch Multas
const fetchMultas = async () => {
  try {
    const response = await authFetch(`${API_BASE_URL}/multas`);
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

  tbody.innerHTML = multas.map(m => `
    <tr>
      <td>${m.usuarios?.nombre || 'N/A'}</td>
      <td>${m.motivo}</td>
      <td>${formatCurrency(m.valor)}</td>
      <td>${new Date(m.fecha_multa).toLocaleDateString('es-CO')}</td>
      <td><span class="badge ${m.estado === 'pagada' ? 'badge-success' : 'badge-danger'}">${m.estado}</span></td>
    </tr>
  `).join('');
};

const displayError = (section) => {
  const tableId = `${section}Table`;
  const table = document.querySelector(`#${tableId}`);
  if (table) {
    const tbody = table.querySelector('tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:red;">Error cargando datos</td></tr>';
  }
};

// Navigation - Setup after DOM is ready
const setupNavigation = () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.getAttribute('data-section');

      // Update active nav
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Hide all sections
      document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));

      // Show selected section
      const sectionEl = document.getElementById(`${section}-section`);
      if (sectionEl) {
        sectionEl.classList.add('active');

        // Fetch data for section
        if (section === 'usuarios') fetchUsuarios();
        if (section === 'cuotas') fetchCuotas();
        if (section === 'creditos') fetchCreditos();
        if (section === 'multas') fetchMultas();
      }

      // Update title
      const titles = {
        dashboard: 'Dashboard',
        usuarios: 'Usuarios',
        cuotas: 'Cuotas',
        creditos: 'Créditos',
        multas: 'Multas'
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

// Filtro de usuarios - búsqueda por nombre
document.getElementById('usuariosSearch')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value;
  displayUsuarios(usuariosCache, searchTerm);
});

// Botón de búsqueda de crédito por cédula
document.getElementById('btnBuscarCredito')?.addEventListener('click', () => {
  const cedula = document.getElementById('creditosBuscarCedula')?.value;
  buscarCreditoPorCedula(cedula);
});

// Permitir búsqueda con Enter
document.getElementById('creditosBuscarCedula')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const cedula = e.target.value;
    buscarCreditoPorCedula(cedula);
  }
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Revisor panel loaded');
  setupNavigation();
  fetchDashboardData();

  // Auto-refresh every 5 minutes
  setInterval(fetchDashboardData, 300000);
});
