import { supabaseAdmin } from './src/db.js';

async function testMultas() {
  try {
    const { data: multas, error } = await supabaseAdmin
      .from('multas')
      .select('id, usuario_id, valor, estado');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Total multas en BD:', multas.length);
    console.log('\nDetalle de cada multa:');
    multas.forEach(m => {
      console.log(`ID: ${m.id}, Usuario: ${m.usuario_id}, Valor: ${m.valor}, Estado: "${m.estado}" (length: ${m.estado?.length || 0})`);
    });

    const pagadas = multas.filter(m => m.estado === 'pagada');
    const pendientes = multas.filter(m => m.estado === 'pendiente');
    const otros = multas.filter(m => m.estado !== 'pagada' && m.estado !== 'pendiente');

    console.log('\n=== RESUMEN ===');
    console.log(`Pagadas: ${pagadas.length} multas = $${pagadas.reduce((s, m) => s + m.valor, 0)}`);
    console.log(`Pendientes: ${pendientes.length} multas = $${pendientes.reduce((s, m) => s + m.valor, 0)}`);
    console.log(`Otros estados: ${otros.length}`);
    if (otros.length > 0) {
      console.log('Otros estados encontrados:');
      otros.forEach(m => console.log(`  - ID ${m.id}: "${m.estado}"`));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMultas();
