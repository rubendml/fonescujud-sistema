# Guía de Carga Masiva de Usuarios desde Excel

## 📋 Resumen
Este sistema permite cargar usuarios de forma masiva desde un archivo Excel, facilitando la inicialización del sistema con datos existentes.

---

## 🎯 Paso 1: Obtener la Plantilla

La plantilla Excel ya está generada en:
```
D:\PROGRAMADOR\FONESCUJUD VER2\fonescujud-sistema\plantilla-usuarios\plantilla-usuarios.xlsx
```

Si necesitas regenerarla, ejecuta:
```bash
cd "d:\PROGRAMADOR\FONESCUJUD VER2\fonescujud-sistema\backend"
node generar-plantilla-excel.js
```

---

## ✏️ Paso 2: Llenar la Plantilla

### Formato Requerido:

| nombre | cedula | email | telefono | afiliado | direccion |
|--------|--------|-------|----------|----------|-----------|

### Campos:

**Obligatorios:**
- **nombre**: Nombre completo del usuario
- **cedula**: Número de cédula sin puntos ni comas
- **afiliado**: Debe ser exactamente "SI" o "NO" (mayúsculas)

**Opcionales:**
- **email**: Correo electrónico
- **telefono**: Número de teléfono celular
- **direccion**: Dirección de residencia

### ⚠️ Reglas Importantes:

1. **NO modifiques los nombres de las columnas**
2. **NO dejes espacios en blanco** antes o después de los datos
3. La cédula debe ser **única** (no se pueden repetir)
4. El campo `afiliado` debe ser exactamente **"SI"** o **"NO"** (en mayúsculas)
5. Puedes eliminar los ejemplos y agregar tus propios datos
6. Guarda el archivo en formato `.xlsx` (Excel)

### ✅ Ejemplo Correcto:

```
nombre: Roberto José Hernández
cedula: 1000123456
email: roberto.hernandez@empresa.com
telefono: 3151234567
afiliado: SI
direccion: Calle 50 #23-45 Apt 301
```

### ❌ Errores Comunes:

- ❌ `afiliado: si` (debe ser SI en mayúsculas)
- ❌ `cedula: 1.000.123` (no uses puntos ni comas)
- ❌ Dejar la columna `nombre` vacía
- ❌ Modificar el nombre de las columnas

---

## 🚀 Paso 3: Cargar el Archivo

### Opción A: Desde la misma carpeta

1. Copia tu archivo Excel lleno a la carpeta `backend`:
   ```bash
   # Ejemplo: copiar archivo desde el escritorio
   copy "C:\Users\TuUsuario\Desktop\usuarios.xlsx" "d:\PROGRAMADOR\FONESCUJUD VER2\fonescujud-sistema\backend\"
   ```

2. Ejecuta el script de carga:
   ```bash
   cd "d:\PROGRAMADOR\FONESCUJUD VER2\fonescujud-sistema\backend"
   node cargar-usuarios-excel.js usuarios.xlsx
   ```

### Opción B: Desde cualquier ubicación

```bash
cd "d:\PROGRAMADOR\FONESCUJUD VER2\fonescujud-sistema\backend"
node cargar-usuarios-excel.js "C:\ruta\completa\a\tu\archivo.xlsx"
```

---

## 📊 Interpretando los Resultados

Durante la carga verás mensajes como:

### ✅ Usuario creado exitosamente:
```
✅ Usuario creado: Juan Pérez García (1234567890) - AFILIADO
```

### ⏭️ Usuario ya existe (omitido):
```
⏭️ Usuario Juan Pérez García (1234567890) ya existe - omitido
```

### ❌ Error en un usuario:
```
❌ Error procesando usuario María López: Faltan campos requeridos
```

### 📈 Resumen Final:
```
📈 Resumen de carga:
   Total procesados: 50
   Exitosos: 48
   Errores: 2

⚠️ Detalles de errores:
   - Usuario X (cedula Y): error específico
```

---

## 🔧 Solución de Problemas

### Error: "Faltan campos requeridos"
- **Causa**: Falta el nombre o la cédula
- **Solución**: Verifica que todas las filas tengan nombre y cédula

### Error: "Usuario ya existe"
- **Causa**: Ya hay un usuario con esa cédula en la base de datos
- **Solución**: Esto es normal, el sistema omite duplicados automáticamente

### Error: "No se puede leer el archivo"
- **Causa**: Ruta incorrecta o archivo abierto en Excel
- **Solución**: 
  - Cierra el archivo Excel si está abierto
  - Verifica que la ruta sea correcta
  - Usa comillas si la ruta tiene espacios

### Error de conexión a base de datos
- **Causa**: Variables de entorno no configuradas
- **Solución**: Verifica que el archivo `.env` en `backend` tenga las credenciales correctas

---

## 📝 Ejemplo Completo

### 1. Preparar datos en Excel:

| nombre | cedula | email | telefono | afiliado | direccion |
|--------|--------|-------|----------|----------|-----------|
| Luis Gómez | 10001234 | luis@email.com | 3001234567 | SI | Calle 10 #20-30 |
| Ana Torres | 20005678 | ana@email.com | 3109876543 | NO | Carrera 5 #15-25 |
| Pedro Ruiz | 30009012 | pedro@email.com | 3201122334 | SI | Avenida 30 #40-50 |

### 2. Guardar como `mis-usuarios.xlsx`

### 3. Ejecutar:
```bash
cd "d:\PROGRAMADOR\FONESCUJUD VER2\fonescujud-sistema\backend"
node cargar-usuarios-excel.js mis-usuarios.xlsx
```

### 4. Ver resultado:
```
📂 Leyendo archivo Excel...

📊 Total de usuarios a procesar: 3

✅ Usuario creado: Luis Gómez (10001234) - AFILIADO
✅ Usuario creado: Ana Torres (20005678) - NO AFILIADO
✅ Usuario creado: Pedro Ruiz (30009012) - AFILIADO

📈 Resumen de carga:
   Total procesados: 3
   Exitosos: 3
   Errores: 0

✨ Proceso completado
```

---

## 🎓 Consejos

1. **Prueba primero con pocos usuarios** (3-5) para verificar que todo funcione
2. **Haz respaldo** de tu archivo Excel antes de cargarlo
3. **Revisa los datos** después de cargarlos en el sistema web
4. Si hay errores, **corrígelos en el Excel** y vuelve a ejecutar el script
5. Los usuarios duplicados serán **omitidos automáticamente** (no da error)

---

## 📞 Ubicación de Archivos

```
fonescujud-sistema/
├── backend/
│   ├── cargar-usuarios-excel.js     ← Script de carga
│   └── generar-plantilla-excel.js   ← Generador de plantilla
└── plantilla-usuarios/
    ├── plantilla-usuarios.xlsx      ← Plantilla Excel
    └── INSTRUCCIONES.md             ← Este archivo
```

---

**✅ ¡Listo! Ahora puedes cargar usuarios masivamente al sistema.**
