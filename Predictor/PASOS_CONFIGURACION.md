# 🚀 Pasos Rápidos de Configuración

## ⚡ Resumen Ejecutivo (5 minutos)

### 1️⃣ Crear Proyecto Supabase
```
1. Ve a: https://supabase.com
2. Crea cuenta / Inicia sesión
3. Click en "New Project"
4. Nombre: "time-predictor"
5. Crea contraseña de BD (guárdala)
6. Espera 2-3 minutos
```

### 2️⃣ Ejecutar SQL
```
1. En Supabase → SQL Editor
2. Click "New Query"
3. Abre: db/schema.sql
4. Copia TODO el contenido
5. Pega en Supabase SQL Editor
6. Click "Run" (o Ctrl+Enter)
```

### 3️⃣ Obtener Credenciales
```
1. En Supabase → Settings → API
2. Copia "Project URL"
3. Copia "anon public" key
```

### 4️⃣ Crear .env.local
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=pega_aqui_el_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=pega_aqui_el_anon_key
```

### 5️⃣ Probar
```bash
pnpm dev
```

Abre http://localhost:3000 y prueba crear un usuario.

---

## 📸 Guía Visual Detallada

### Paso 1: Supabase Dashboard

Después de crear tu proyecto, verás algo así:

```
┌─────────────────────────────────────┐
│  Supabase Dashboard                 │
├─────────────────────────────────────┤
│  [📊 Table Editor]                  │
│  [📝 SQL Editor]  ← Click aquí      │
│  [⚙️ Settings]                      │
│  [🔐 Authentication]                 │
└─────────────────────────────────────┘
```

### Paso 2: SQL Editor

```
┌─────────────────────────────────────┐
│  SQL Editor                          │
├─────────────────────────────────────┤
│  [New Query]  ← Click aquí          │
│                                     │
│  ┌───────────────────────────────┐   │
│  │ Pega aquí el contenido de    │   │
│  │ db/schema.sql                │   │
│  │                              │   │
│  └───────────────────────────────┘   │
│                                     │
│  [Run]  ← Click para ejecutar       │
└─────────────────────────────────────┘
```

### Paso 3: Settings → API

```
┌─────────────────────────────────────┐
│  API Settings                        │
├─────────────────────────────────────┤
│  Project URL:                        │
│  https://xxxxx.supabase.co  ← Copia │
│                                     │
│  Project API keys:                   │
│  ┌───────────────────────────────┐  │
│  │ anon public                   │  │
│  │ eyJhbGciOiJIUzI1NiIsInR5c... │  │
│  │                    [Reveal]   │  │
│  └───────────────────────────────┘  │
│                        ↑ Copia esto  │
└─────────────────────────────────────┘
```

### Paso 4: Archivo .env.local

Crea este archivo en la raíz del proyecto:

```
Predictor/
├── app/
├── components/
├── db/
├── .env.local  ← CREA ESTE ARCHIVO AQUÍ
├── package.json
└── ...
```

Contenido del archivo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzE2ODAwMCwiZXhwIjoxOTYyNzQ0MDAwfQ.abcdefghijklmnopqrstuvwxyz
```

**⚠️ IMPORTANTE:**
- Sin espacios alrededor del `=`
- Sin comillas
- Una línea por variable
- Reemplaza los valores con los tuyos

---

## ✅ Checklist de Verificación

Marca cada paso cuando lo completes:

- [ ] Proyecto creado en Supabase
- [ ] SQL ejecutado sin errores
- [ ] Tablas visibles en "Table Editor" (users, sessions, predictions)
- [ ] Credenciales copiadas (URL y anon key)
- [ ] Archivo `.env.local` creado
- [ ] Valores pegados en `.env.local`
- [ ] Servidor reiniciado (`pnpm dev`)
- [ ] Aplicación carga sin errores
- [ ] Puedo crear un usuario
- [ ] Puedo crear una sesión (admin)

---

## 🎯 Comandos Rápidos

```bash
# 1. Instalar dependencias (si no lo has hecho)
pnpm install

# 2. Crear archivo .env.local (Windows PowerShell)
New-Item -Path .env.local -ItemType File

# 2. Crear archivo .env.local (Mac/Linux)
touch .env.local

# 3. Editar .env.local (cualquier editor)
# Agrega las variables de entorno

# 4. Ejecutar aplicación
pnpm dev
```

---

## 🆘 ¿Problemas?

### "Cannot find module '@supabase/supabase-js'"
```bash
pnpm install
```

### "Invalid API key"
- Verifica que copiaste la clave **anon public** completa
- Verifica que no hay espacios extra
- Verifica que el archivo se llama `.env.local` (con el punto)

### "relation does not exist"
- Ve a Supabase → SQL Editor
- Ejecuta el script `db/schema.sql` de nuevo
- Verifica en "Table Editor" que existen las 3 tablas

### La app no se conecta
- Verifica que `.env.local` está en la raíz del proyecto
- Reinicia el servidor después de crear/modificar `.env.local`
- Verifica que las variables empiezan con `NEXT_PUBLIC_`

---

## 📞 Siguiente Paso

Una vez configurado, puedes:
1. Ejecutar `pnpm dev`
2. Abrir http://localhost:3000
3. Probar crear usuarios y sesiones

¡Listo! 🎉

