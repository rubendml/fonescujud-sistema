# Guía para Subir a GitHub - FONESCUJUD

## 📝 Paso 1: Preparar el Repositorio Localmente

```bash
# Navegar a la carpeta del proyecto
cd d:/PROGRAMADOR/FONESCUJUD\ VER2/fonescujud-sistema

# Inicializar git (si no está iniciado)
git init

# Agregar todos los archivos
git add .

# Crear primer commit
git commit -m "Initial commit: FONESCUJUD Sistema de Gestión v1.0"
```

## 🔧 Paso 2: Crear Repositorio en GitHub

1. **Ir a https://github.com/new**
2. **Nombre del repositorio**: `fonescujud-sistema` (o el que prefieras)
3. **Descripción**: "Sistema integral de gestión del fondo de empleados FONESCUJUD 2026"
4. **Privado o Público**: Elegir según necesidad
5. **Agregar .gitignore**: Seleccionar "Node"
6. **Licencia**: MIT (recomendado)
7. **Crear repositorio**

## 🔗 Paso 3: Conectar Repositorio Local con GitHub

```bash
# Agregar remote (reemplazar USERNAME y REPO)
git remote add origin https://github.com/USERNAME/fonescujud-sistema.git

# Verificar que se agregó correctamente
git remote -v

# Subir cambios (usar -u para establecer upstream)
git branch -M main
git push -u origin main
```

## 🔐 Paso 4: Configurar Secretos en GitHub (opcional)

Para CI/CD automático:

1. **Ir a Settings → Secrets and variables → Actions**
2. **Crear nuevos secretos**:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`

```bash
# Comando: New repository secret
# Name: SUPABASE_URL
# Value: https://tu-proyecto.supabase.co
```

## 📦 Paso 5: Estructura Final para GitHub

```
fonescujud-sistema/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── backend/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── public/
│   ├── admin/
│   └── revisor/
├── database/
│   ├── schema.sql
│   └── data-sample.sql
├── .gitignore
├── README.md
├── INSTALACION.md
└── LICENSE
```

## 🚀 Paso 6: Primeros Cambios y Push

```bash
# Ver estado
git status

# Ver cambios locales
git log --oneline -5

# Hacer push
git push origin main

# Si hay conflictos
git pull origin main
git merge --no-ff origin/main
git push origin main
```

## 📋 Checklist Pre-Upload

- [ ] `.env` NO está en el repositorio (incluido en .gitignore)
- [ ] `node_modules/` NO está incluido
- [ ] README.md actualizado
- [ ] INSTALACION.md incluido
- [ ] LICENSE incluido
- [ ] .gitignore configurado correctamente
- [ ] Todos los archivos esenciales incluidos
- [ ] Sin archivos de configuración sensibles

## 🔄 Flujo de Trabajo Git Recomendado

### Para Desarrollo

```bash
# Crear rama de desarrollo
git checkout -b develop

# Crear rama de feature
git checkout -b feature/nombre-feature

# Hacer cambios y commit
git add .
git commit -m "feat: descripción del cambio"

# Subir rama
git push origin feature/nombre-feature

# Crear Pull Request en GitHub
# (desde interfaz web)

# Merge a develop
# (desde interfaz web after review)

# Actualizar local
git checkout develop
git pull origin develop
```

### Commits Semánticos

Usar prefijos en mensajes:

- `feat:` Nueva característica
- `fix:` Corrección de error
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin lógica)
- `refactor:` Refactorización de código
- `perf:` Mejora de rendimiento
- `test:` Agregar/modificar tests
- `chore:` Cambios en configuración

Ejemplos:
```bash
git commit -m "feat: agregar panel de admin"
git commit -m "fix: corregir cálculo de intereses"
git commit -m "docs: actualizar README con instrucciones"
```

## 📊 Ramas Recomendadas

- **main**: Producción (merge solo desde release)
- **develop**: Desarrollo (merge de features)
- **feature/***: Nuevas características
- **hotfix/***: Correcciones urgentes
- **release/***: Preparación de release

## 🔒 Proteger Rama Main

En GitHub > Settings > Branches:

1. **Ir a Branch protection rules**
2. **Agregar rule para `main`**
3. **Configurar**:
   - [x] Require pull request reviews before merging
   - [x] Require status checks to pass
   - [x] Require branches to be up to date
   - [x] Dismiss stale reviews
   - [x] Require code owners approval

## 📝 Escribir Buen README

El README.md debe incluir:

- [ ] Título y descripción del proyecto
- [ ] Tecnologías usadas
- [ ] Instalación paso a paso
- [ ] Estructura de carpetas
- [ ] Configuración de variables de entorno
- [ ] Comandos disponibles
- [ ] API endpoints
- [ ] Guía de contribución
- [ ] Licencia
- [ ] Contacto/Soporte

## 🎯 Tareas Post-Upload

```bash
# 1. Crear releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 2. Crear GitHub Pages (si aplica)
# Settings > Pages > Deploy from branch

# 3. Configurar Issues templates
# .github/ISSUE_TEMPLATE/bug_report.md

# 4. Configurar FUNDING.yml (si aplica)
# .github/FUNDING.yml

# 5. Crear badges en README
# ![Node.js](https://img.shields.io/badge/Node.js-18+-green)
```

## 📈 Monitoreo del Repositorio

- Habilitar GitHub Actions para CI/CD
- Configurar renovabot para dependencias
- Agregar code coverage badges
- Monitorear issues y PRs
- Mantener documentación actualizada

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| fatal: not a git repository | Ejecutar `git init` en carpeta |
| permission denied (publickey) | Generar SSH key y agregar a GitHub |
| remote origin already exists | `git remote remove origin` |
| rejected (fetch first) | `git pull origin main` |
| large files | Usar Git LFS para archivos >100MB |

## 💡 Recursos Útiles

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://github.gitignore.io)
- [Semantic Versioning](https://semver.org)
- [Conventional Commits](https://www.conventionalcommits.org)
- [GitHub Skills](https://skills.github.com)

## ✅ Verificación Final

```bash
# Ver status final
git status

# Ver commits
git log --oneline | head -10

# Ver ramas
git branch -a

# Ver remote
git remote -v
```

---

**¡Listo! Tu proyecto está en GitHub y listo para colaboración.**

Para próximos pushes:
```bash
git add .
git commit -m "tu mensaje"
git push origin main
```
