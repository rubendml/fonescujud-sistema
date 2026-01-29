# FONESCUJUD - Sistema de Gestión del Fondo de Empleados 2026

## 📋 Descripción del Proyecto

Sistema integral en línea para la gestión del fondo de empleados FONESCUJUD. Permite administrar:

- **Usuarios/Afiliados**: Gestión completa de personas afiliadas y no afiliadas
- **Recaudo de Cuotas**: Seguimiento de pagos mensuales y extraordinarios
- **Créditos**: Gestión de préstamos con cálculo automático de intereses
- **Multas**: Registro de sanciones por mora en pagos
- **Dashboard**: Panel de resumen financiero público y privado

## 🏗️ Estructura del Proyecto

```
fonescujud-sistema/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio
│   │   ├── routes/               # Rutas API
│   │   ├── middleware/           # Autenticación y validaciones
│   │   ├── utils/                # Funciones auxiliares
│   │   ├── config.js             # Configuración
│   │   ├── db.js                 # Conexión Supabase
│   │   └── server.js             # Servidor principal
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── public/                   # Dashboard público
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── script.js
│   ├── admin/                    # Panel administrador
│   │   ├── index.html
│   │   ├── admin-styles.css
│   │   └── admin-script.js
│   └── revisor/                  # Panel revisor (lectura)
│       ├── index.html
│       ├── revisor-styles.css
│       └── revisor-script.js
├── database/
│   └── schema.sql                # Scripts SQL
└── README.md
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js v16+
- npm o yarn
- Una cuenta Supabase (https://supabase.com)
- Git

### 1. Configurar Base de Datos (Supabase)

1. Crear un proyecto en Supabase
2. Ir a SQL Editor y ejecutar el script `database/schema.sql`
3. Copiar las credenciales:
   - Project URL
   - Anon Key
   - Service Role Key

### 2. Configurar Backend

```bash
cd backend

# Crear archivo .env
cp .env.example .env

# Llenar variables de entorno
# SUPABASE_URL=tu_url_aqui
# SUPABASE_KEY=tu_key_aqui
# SUPABASE_SERVICE_ROLE_KEY=tu_service_key_aqui
# JWT_SECRET=tu_secreto_fuerte_aqui
# PORT=3000
# NODE_ENV=development

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### 3. Frontend

Los archivos frontend están listos para usar. Solo necesita servir con un servidor HTTP:

```bash
# Usando Python 3
python -m http.server 8000

# O usando Node.js (http-server)
npm install -g http-server
http-server frontend/
```

Accede a:
- **Dashboard Público**: `http://localhost:8000/public/`
- **Panel Admin**: `http://localhost:8000/admin/`
- **Panel Revisor**: `http://localhost:8000/revisor/`

## 📱 Interfaces

### 1. Dashboard Público (`/public/`)
- Vista de solo lectura
- Muestra resumen financiero general
- Información de afiliados
- Estado de créditos y multas
- Actualización automática cada 5 minutos

### 2. Panel Administrador (`/admin/`)
- Gestión completa de usuarios
- Registro de cuotas mensuales
- Creación y seguimiento de créditos
- Registro de multas
- Acceso completo a reportes
- Requiere autenticación como admin

### 3. Panel Revisor (`/revisor/`)
- Acceso de solo lectura
- Visualización de todos los datos
- Reportes y estadísticas
- No puede realizar cambios
- Requiere autenticación como revisor

## 🔐 Seguridad

### Autenticación

- Supabase Auth con JWT
- Roles: Admin y Revisor
- Middleware de autenticación en todas las rutas protegidas

### Control de Acceso

```javascript
// Admin: Acceso completo
GET /api/usuarios          ✓
POST /api/usuarios         ✓ (solo admin)
PUT /api/usuarios/:id      ✓ (solo admin)

// Revisor: Solo lectura
GET /api/usuarios          ✓
POST /api/usuarios         ✗
PUT /api/usuarios/:id      ✗
```

## 📊 API Endpoints

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario específico
- `POST /api/usuarios` - Crear usuario (admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (admin)

### Cuotas
- `GET /api/cuotas` - Obtener todas las cuotas
- `GET /api/cuotas/usuario/:usuario_id` - Cuotas de un usuario
- `GET /api/cuotas/resumen` - Resumen de recaudo
- `POST /api/cuotas` - Registrar cuota (admin)

### Créditos
- `GET /api/creditos` - Obtener todos los créditos
- `GET /api/creditos/usuario/:usuario_id` - Créditos de un usuario
- `GET /api/creditos/resumen` - Resumen de créditos
- `POST /api/creditos` - Crear crédito (admin)
- `POST /api/creditos/abono` - Registrar abono (admin)

### Multas
- `GET /api/multas` - Obtener todas las multas
- `GET /api/multas/usuario/:usuario_id` - Multas de un usuario
- `GET /api/multas/resumen` - Resumen de multas
- `POST /api/multas` - Registrar multa (admin)
- `PATCH /api/multas/:id/pagar` - Pagar multa (admin)

### Dashboard
- `GET /api/dashboard` - Resumen financiero general

## 💰 Cálculos Financieros

### Interés Simple en Créditos
```
Interés = (Capital × Tasa % × Meses) / 100
```

### Tasas
- **Afiliados**: 3% anual
- **No Afiliados**: 5% anual

### Cuota Mensal
- Valor estándar: $200,000 COP
- Cuota extraordinaria: Julio (mes 7)

## 📈 Monitoreo y Reportes

El dashboard permite seguimiento en tiempo real de:

1. **Ingresos Totales**
   - Cuotas recaudadas
   - Intereses cobrados
   - Multas recaudadas

2. **Fondos en Uso**
   - Total desembolsado en créditos
   - Saldo pendiente

3. **Por Cobrar**
   - Saldos de créditos
   - Multas pendientes

## 🔄 Flujos de Trabajo

### Flujo de Crédito

1. **Solicitud**: Administrador crea nuevo crédito
2. **Desembolso**: Se registra automáticamente
3. **Interés Inicial**: Se cobran intereses del primer mes adelantado
4. **Abonos**: Usuario puede hacer abonos cuando quiera
5. **Recalcular**: Intereses se cobran sobre saldo restante
6. **Cierre**: Se marca como pagado cuando saldo = 0

### Flujo de Multas

1. **Registro**: Administrador registra multa por mora
2. **Notificación**: Revisor puede visualizar
3. **Pago**: Administrador registra pago
4. **Cierre**: Se marca como pagada

## 🛠️ Desarrollo y Despliegue

### Variables de Entorno (.env)

```env
# Supabase
SUPABASE_URL=https://proyecto.supabase.co
SUPABASE_KEY=anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=service-role-key-aqui

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=secreto-muy-fuerte-aqui
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Lint (si se configura)
npm run lint
```

## 📦 Dependencias Backend

- **Express.js**: Framework web
- **Supabase**: Base de datos y autenticación
- **CORS**: Control de acceso
- **dotenv**: Gestión de variables
- **jsonwebtoken**: Tokens JWT

## 🎨 Diseño

### Colores Corporativos
- **Primario**: #003d5c (Azul oscuro - para admin)
- **Secundario**: #1a472a (Verde oscuro - para revisor)
- **Éxito**: #27ae60
- **Advertencia**: #f39c12
- **Error**: #e74c3c

### Tipografía
- Font: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Responsive: Mobile first

## 📝 Auditoría

Todos los cambios se registran automáticamente en la tabla `auditoria`:
- Usuario que realiza cambio
- Tabla afectada
- Operación (INSERT, UPDATE, DELETE)
- Datos anteriores y nuevos
- Fecha y hora

## 🆘 Soporte y Troubleshooting

### Errores Comunes

**Error: "Cannot connect to Supabase"**
- Verificar variables de entorno
- Confirmar URL y keys correctas

**Error: "CORS error"**
- Configurar CORS en backend
- Verificar origen permitido

**Error: "401 Unauthorized"**
- Verificar token JWT
- Confirmar credenciales de usuario

## 📞 Contacto y Soporte

Para soporte técnico o reportar problemas:
- Email: soporte@fonescujud.com
- Sistema creado: 2026

## 📄 Licencia

MIT License - Todos los derechos reservados para FONESCUJUD

---

**Última actualización**: Enero 2026
