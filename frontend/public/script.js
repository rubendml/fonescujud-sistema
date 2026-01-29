// Utility Functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

// Show/Hide states
const showLoading = () => {
  const loading = document.getElementById('loading');
  const main = document.getElementById('mainContent');
  const error = document.getElementById('errorMessage');
  if (loading) loading.style.display = 'flex';
  if (main) main.style.display = 'none';
  if (error) error.style.display = 'none';
};

const showContent = () => {
  const loading = document.getElementById('loading');
  const main = document.getElementById('mainContent');
  const error = document.getElementById('errorMessage');
  if (loading) loading.style.display = 'none';
  if (main) main.style.display = 'block';
  if (error) error.style.display = 'none';
};

const showError = () => {
  const loading = document.getElementById('loading');
  const main = document.getElementById('mainContent');
  const error = document.getElementById('errorMessage');
  if (loading) loading.style.display = 'none';
  if (main) main.style.display = 'none';
  if (error) error.style.display = 'block';
};

// Fetch Dashboard Data
const fetchDashboardData = async () => {
  try {
    showLoading();
    console.log('Fetching from:', `${API_BASE_URL}/dashboard`);
    
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log('Data received:', data);
    updateDashboard(data);
    showContent();
    
    // Update timestamp
    const now = new Date();
    const el = document.getElementById('lastUpdate');
    if (el) el.textContent = now.toLocaleString('es-CO');
  } catch (error) {
    console.error('Fetch error:', error);
    showError();
  }
};

// Update Dashboard with Data - Compatible with public HTML IDs
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
  const creditosActivos2 = document.getElementById('creditosActivos');
  const porCobrar = document.getElementById('porCobrar');

  if (afiliados) afiliados.textContent = resumen?.usuarios_afiliados || 0;
  if (noAfiliados) noAfiliados.textContent = resumen?.usuarios_no_afiliados || 0;
  if (creditosActivos2) creditosActivos2.textContent = resumen?.creditos_activos || 0;
  if (porCobrar) porCobrar.textContent = formatCurrency(resumen?.multas_pendientes || 0);
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Public dashboard page loaded');
  fetchDashboardData();
  // Auto-refresh every 5 minutes
  setInterval(fetchDashboardData, 300000);
});
