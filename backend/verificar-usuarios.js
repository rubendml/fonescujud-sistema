// Script para verificar usuarios en Supabase
import 'dotenv/config';
import { supabaseAdmin } from './src/db.js';

async function verificarUsuarios() {
    console.log('🔍 Verificando usuarios en Supabase...\n');
    
    try {
        const { data: usuarios, error } = await supabaseAdmin
            .from('usuarios')
            .select('id, usuario, password, nombre, email, rol, estado')
            .order('id');

        if (error) {
            console.error('❌ Error al consultar usuarios:', error);
            return;
        }

        if (!usuarios || usuarios.length === 0) {
            console.log('⚠️  No hay usuarios en la base de datos');
            return;
        }

        console.log(`✅ Se encontraron ${usuarios.length} usuarios:\n`);
        
        usuarios.forEach(u => {
            console.log(`ID: ${u.id}`);
            console.log(`Usuario: ${u.usuario}`);
            console.log(`Password: ${u.password}`);
            console.log(`Nombre: ${u.nombre}`);
            console.log(`Email: ${u.email}`);
            console.log(`Rol: ${u.rol}`);
            console.log(`Estado: ${u.estado ? 'Activo' : 'Inactivo'}`);
            console.log('---');
        });

        // Verificar específicamente admin y revisor
        console.log('\n🔐 Verificando credenciales de admin y revisor:');
        
        const admin = usuarios.find(u => u.usuario === 'admin');
        if (admin) {
            console.log(`✅ Admin existe - Password: "${admin.password}"`);
        } else {
            console.log('❌ No se encontró usuario "admin"');
        }

        const revisor = usuarios.find(u => u.usuario === 'revisor');
        if (revisor) {
            console.log(`✅ Revisor existe - Password: "${revisor.password}"`);
        } else {
            console.log('❌ No se encontró usuario "revisor"');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

verificarUsuarios();
