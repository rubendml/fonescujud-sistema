// ===============================
// UTILIDADES
// ===============================
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value || 0);
};

// ===============================
// ESTADOS UI
// ===============================
const showLoading = () => {
  document.getElementById('loading')?.style.setProperty('display', 'flex');
  document.getElementById('mainContent')?.style.setProperty('display', 'none');
  document.getElementById('errorMessage')?.style.setProperty('display', 'none');
};

const showContent = () => {
  document.getElementById('loading')?.style.setProperty('display', 'none');
  document.getElementById('mainContent')?.style.setProperty('display', 'block');
  document.getElementById('errorMessage')?.style.setProperty('display', 'none');
};

const showError = () => {
  document.getElementById('loading')?.style.setProperty('display', 'none');
  document.getElementById('mainContent')?.style.setProperty('display', 'none');
  document.getElementById('errorMessage')?.style.setProperty('display', 'block');
};

// ===============================
// FETCH DATA
// ===============================
const fetchDashboardData = async () => {
  try {
    showLoading();

    console.log('📡 Fetching:', `${API_BASE_URL}/dashboard`);

    const response = await fetch(`${API_BASE_URL}/dashboard`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Data:', data);

    updateDashboard(data);
    showContent();

    // Fecha actualización
    const now = new Date();
    const el = document.getElementById('lastUpdate');
    if (el) el.textContent = now.toLocaleString('es-CO');

  } catch (error) {
    console.error('❌ Error:', error);
    showError();
  }
};

// ===============================
// UPDATE UI
// ===============================
const updateDashboard = (data) => {
  if (!data || !data.totales) {
    console.warn('⚠️ No hay datos');
    return;
  }

  const { totales, resumen } = data;

  console.log('📊 Totales:', totales);

  // ===============================
  // TARJETAS PRINCIPALES
  // ===============================
  document.getElementById('totalAfiliados') &&
    (document.getElementById('totalAfiliados').textContent = resumen?.usuarios_afiliados || 0);

  document.getElementById('totalCuotas') &&
    (document.getElementById('totalCuotas').textContent = formatCurrency(totales.cuotas));

  document.getElementById('totalCreditos') &&
    (document.getElementById('totalCreditos').textContent = formatCurrency(totales.creditos));

  document.getElementById('totalPorCobrar') &&
    (document.getElementById('totalPorCobrar').textContent = formatCurrency(totales.multas));

  // ===============================
  // INGRESOS
  // ===============================
  document.getElementById('ingresosTotal') &&
    (document.getElementById('ingresosTotal').textContent = formatCurrency(totales.ingresos));

  document.getElementById('ingresoCuotas') &&
    (document.getElementById('ingresoCuotas').textContent = formatCurrency(totales.cuotas));

  document.getElementById('ingresoInteres') &&
    (document.getElementById('ingresoInteres').textContent = formatCurrency(totales.interes_recaudado));

  document.getElementById('ingresoMultas') &&
    (document.getElementById('ingresoMultas').textContent = formatCurrency(totales.multas));

  // 🔥 ABONOS (CORREGIDO)
  document.getElementById('ingresoAbonos') &&
    (document.getElementById('ingresoAbonos').textContent = formatCurrency(totales.abonos));

  // 🔥 DISPONIBLE (CORREGIDO)
  document.getElementById('ingresoDisponible') &&
    (document.getElementById('ingresoDisponible').textContent =
      formatCurrency(totales.efectivo_disponible));
  console.log('EFECTIVO DISPONIBLE:', totales.efectivo_disponible);
  // ===============================
  // PRÉSTAMOS
  // ===============================
  document.getElementById('fondosPrestamos') &&
    (document.getElementById('fondosPrestamos').textContent = formatCurrency(totales.creditos));

  // ===============================
  // POR COBRAR
  // ===============================
  document.getElementById('porCobrarTotal') &&
    (document.getElementById('porCobrarTotal').textContent =
      formatCurrency((resumen?.saldo_pendiente || 0) + (totales.multas || 0)));

  document.getElementById('porCobrarSaldos') &&
    (document.getElementById('porCobrarSaldos').textContent =
      formatCurrency(resumen?.saldo_pendiente || 0));

  document.getElementById('porCobrarMultas') &&
    (document.getElementById('porCobrarMultas').textContent =
      formatCurrency(totales.multas));

  // ===============================
  // INFO GENERAL
  // ===============================
  document.getElementById('afiliados') &&
    (document.getElementById('afiliados').textContent = resumen?.usuarios_afiliados || 0);

  document.getElementById('noAfiliados') &&
    (document.getElementById('noAfiliados').textContent = resumen?.usuarios_no_afiliados || 0);

  document.getElementById('creditosActivos') &&
    (document.getElementById('creditosActivos').textContent = resumen?.creditos_activos || 0);

  document.getElementById('porCobrar') &&
    (document.getElementById('porCobrar').textContent =
      formatCurrency(resumen?.multas_pendientes || 0));
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Dashboard cargado');

  fetchDashboardData();

  // Auto refresh cada 5 min
  setInterval(fetchDashboardData, 300000);
});