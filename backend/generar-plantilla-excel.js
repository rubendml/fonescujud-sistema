import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear plantilla Excel
const plantillaData = [
    {
        nombre: 'Juan Pérez García',
        cedula: '1234567890',
        email: 'juan.perez@email.com',
        telefono: '3001234567',
        afiliado: 'SI',
        direccion: 'Calle 123 #45-67'
    },
    {
        nombre: 'María López Martínez',
        cedula: '9876543210',
        email: 'maria.lopez@email.com',
        telefono: '3109876543',
        afiliado: 'NO',
        direccion: 'Carrera 45 #12-34'
    },
    {
        nombre: 'Carlos Rodríguez Torres',
        cedula: '1122334455',
        email: 'carlos.r@email.com',
        telefono: '3201122334',
        afiliado: 'SI',
        direccion: 'Avenida 68 #89-12'
    }
];

// Crear workbook
const wb = xlsx.utils.book_new();

// Crear worksheet con los datos de ejemplo
const ws = xlsx.utils.json_to_sheet(plantillaData);

// Ajustar anchos de columna
ws['!cols'] = [
    { wch: 30 },  // nombre
    { wch: 15 },  // cedula
    { wch: 30 },  // email
    { wch: 15 },  // telefono
    { wch: 10 },  // afiliado
    { wch: 40 }   // direccion
];

// Agregar worksheet al workbook
xlsx.utils.book_append_sheet(wb, ws, 'Usuarios');

// Guardar archivo
const rutaPlantilla = join(__dirname, '..', 'plantilla-usuarios', 'plantilla-usuarios.xlsx');
xlsx.writeFile(wb, rutaPlantilla);

console.log('✅ Plantilla Excel creada exitosamente:');
console.log(`   ${rutaPlantilla}`);
console.log('\n📝 La plantilla incluye 3 usuarios de ejemplo.');
console.log('   Puedes modificarlos o eliminarlos y agregar tus propios datos.');
