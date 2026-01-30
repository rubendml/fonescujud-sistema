import { supabaseAdmin } from './src/db.js';

/**
 * Script para actualizar el campo interes_cobrado de todos los créditos
 * basándose en la suma de movimientos de tipo 'interes'
 */

async function actualizarInteresesCobrados() {
  try {
    console.log('🔄 Iniciando actualización de intereses cobrados...\n');

    // Obtener todos los créditos
    const { data: creditos, error: errorCreditos } = await supabaseAdmin
      .from('creditos')
      .select('id, monto_original, porcentaje_interes, interes_acumulado, interes_cobrado');

    if (errorCreditos) {
      console.error('❌ Error al obtener créditos:', errorCreditos);
      return;
    }

    console.log(`📊 Total de créditos a procesar: ${creditos.length}\n`);

    let procesados = 0;
    let actualizados = 0;
    let errores = 0;

    for (const credito of creditos) {
      try {
        // Obtener todos los movimientos de interés para este crédito
        const { data: movimientos, error: errorMovimientos } = await supabaseAdmin
          .from('movimientos_creditos')
          .select('monto')
          .eq('credito_id', credito.id)
          .eq('tipo_movimiento', 'interes');

        if (errorMovimientos) {
          console.error(`❌ Error al obtener movimientos del crédito ${credito.id}:`, errorMovimientos);
          errores++;
          continue;
        }

        // Calcular el interés cobrado sumando todos los movimientos de interés
        const interesCobradoCalculado = movimientos.reduce(
          (sum, m) => sum + parseFloat(m.monto || 0),
          0
        );

        // Si el interés cobrado calculado es diferente al actual, actualizar
        if (interesCobradoCalculado !== credito.interes_cobrado) {
          const { error: errorUpdate } = await supabaseAdmin
            .from('creditos')
            .update({
              interes_cobrado: interesCobradoCalculado
            })
            .eq('id', credito.id);

          if (errorUpdate) {
            console.error(`❌ Error al actualizar crédito ${credito.id}:`, errorUpdate);
            errores++;
          } else {
            console.log(
              `✅ Crédito ${credito.id}: Interés cobrado actualizado de $${credito.interes_cobrado?.toLocaleString('es-CO') || 0} a $${interesCobradoCalculado.toLocaleString('es-CO')}`
            );
            actualizados++;
          }
        } else {
          console.log(`⏭️  Crédito ${credito.id}: Ya está actualizado ($${interesCobradoCalculado.toLocaleString('es-CO')})`);
        }

        procesados++;
      } catch (err) {
        console.error(`❌ Error procesando crédito ${credito.id}:`, err.message);
        errores++;
      }
    }

    console.log('\n📈 Resumen de actualización:');
    console.log(`   Total procesados: ${procesados}`);
    console.log(`   Actualizados: ${actualizados}`);
    console.log(`   Errores: ${errores}`);
    console.log('\n✨ Proceso completado');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar el script
actualizarInteresesCobrados();
