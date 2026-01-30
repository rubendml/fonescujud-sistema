import { supabaseAdmin } from './src/db.js';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script para cargar usuarios desde archivo Excel
 * 
 * Formato esperado del Excel:
 * - Hoja: "Usuarios"
 * - Columnas: nombre | cedula | email | telefono | afiliado | direccion
 * - afiliado debe ser "SI" o "NO"
 */

async function cargarUsuariosDesdeExcel(archivoExcel) {
    try {
        console.log('📂 Leyendo archivo Excel...\n');
        
        // Leer el archivo Excel
        const workbook = xlsx.readFile(archivoExcel);
        const sheetName = workbook.SheetNames[0]; // Primera hoja
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir a JSON
        const usuarios = xlsx.utils.sheet_to_json(worksheet);
        
        console.log(`📊 Total de usuarios a procesar: ${usuarios.length}\n`);
        
        let procesados = 0;
        let exitosos = 0;
        let errores = 0;
        const erroresDetalle = [];
        
        for (const usuario of usuarios) {
            try {
                // Validar campos requeridos
                if (!usuario.nombre || !usuario.cedula) {
                    throw new Error('Faltan campos requeridos: nombre y cédula');
                }
                
                // Normalizar datos
                const usuarioData = {
                    nombre: usuario.nombre.toString().trim(),
                    cedula: usuario.cedula.toString().trim(),
                    email: usuario.email ? usuario.email.toString().trim() : null,
                    telefono: usuario.telefono ? usuario.telefono.toString().trim() : null,
                    afiliado: usuario.afiliado?.toString().toUpperCase() === 'SI',
                    direccion: usuario.direccion ? usuario.direccion.toString().trim() : null
                };
                
                // Verificar si el usuario ya existe
                const { data: existente } = await supabaseAdmin
                    .from('usuarios')
                    .select('id, nombre')
                    .eq('cedula', usuarioData.cedula)
                    .single();
                
                if (existente) {
                    console.log(`⏭️  Usuario ${usuarioData.nombre} (${usuarioData.cedula}) ya existe - omitido`);
                    procesados++;
                    continue;
                }
                
                // Insertar usuario
                const { data, error } = await supabaseAdmin
                    .from('usuarios')
                    .insert([usuarioData])
                    .select();
                
                if (error) throw error;
                
                console.log(`✅ Usuario creado: ${usuarioData.nombre} (${usuarioData.cedula}) - ${usuarioData.afiliado ? 'AFILIADO' : 'NO AFILIADO'}`);
                exitosos++;
                procesados++;
                
            } catch (err) {
                console.error(`❌ Error procesando usuario ${usuario.nombre || 'desconocido'}: ${err.message}`);
                erroresDetalle.push({
                    nombre: usuario.nombre,
                    cedula: usuario.cedula,
                    error: err.message
                });
                errores++;
                procesados++;
            }
        }
        
        console.log('\n📈 Resumen de carga:');
        console.log(`   Total procesados: ${procesados}`);
        console.log(`   Exitosos: ${exitosos}`);
        console.log(`   Errores: ${errores}`);
        
        if (erroresDetalle.length > 0) {
            console.log('\n⚠️  Detalles de errores:');
            erroresDetalle.forEach(e => {
                console.log(`   - ${e.nombre} (${e.cedula}): ${e.error}`);
            });
        }
        
        console.log('\n✨ Proceso completado');
        
    } catch (error) {
        console.error('❌ Error fatal:', error.message);
        process.exit(1);
    }
}

// Ejecutar
const archivoExcel = process.argv[2];

if (!archivoExcel) {
    console.error('❌ Debes especificar el archivo Excel');
    console.log('Uso: node cargar-usuarios-excel.js <ruta-archivo.xlsx>');
    console.log('Ejemplo: node cargar-usuarios-excel.js usuarios.xlsx');
    process.exit(1);
}

cargarUsuariosDesdeExcel(archivoExcel);
