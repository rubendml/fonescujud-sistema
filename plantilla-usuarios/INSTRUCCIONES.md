# Plantilla de Carga de Usuarios - FONESCUJUD

## Formato del Archivo Excel

### Instrucciones:
1. Llena esta plantilla con los datos de los usuarios
2. **NO modifiques el nombre de las columnas**
3. El campo `afiliado` debe ser "SI" o "NO"
4. Los campos `nombre` y `cedula` son obligatorios
5. Guarda el archivo como `.xlsx` (Excel)

### Columnas:

| nombre | cedula | email | telefono | afiliado | direccion |
|--------|--------|-------|----------|----------|-----------|
| Juan Pérez García | 1234567890 | juan.perez@email.com | 3001234567 | SI | Calle 123 #45-67 |
| María López | 9876543210 | maria.lopez@email.com | 3109876543 | NO | Carrera 45 #12-34 |
| Carlos Rodríguez | 1122334455 | carlos.r@email.com | 3201122334 | SI | Avenida 68 #89-12 |

### Campos:
- **nombre**: Nombre completo del usuario (obligatorio)
- **cedula**: Número de cédula sin puntos ni comas (obligatorio)
- **email**: Correo electrónico (opcional)
- **telefono**: Número de teléfono celular (opcional)
- **afiliado**: SI o NO - indica si es afiliado al fondo (obligatorio)
- **direccion**: Dirección de residencia (opcional)

## Notas Importantes:
- Los usuarios con cédula duplicada serán omitidos
- El sistema validará automáticamente los datos
- Se mostrará un resumen al finalizar la carga

## Ejemplo de uso correcto:

### Usuario Afiliado:
```
nombre: Roberto José Hernández
cedula: 1000123456
email: roberto.hernandez@empresa.com
telefono: 3151234567
afiliado: SI
direccion: Calle 50 #23-45 Apt 301
```

### Usuario No Afiliado:
```
nombre: Ana María Gómez
cedula: 2000987654
email: ana.gomez@correo.com
telefono: 3209876543
afiliado: NO
direccion: Carrera 80 #15-20
```

---
**FONESCUJUD - Sistema de Gestión Financiera**
