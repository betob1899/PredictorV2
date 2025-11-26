# ✅ Guía de Verificación Completa

Esta guía te ayudará a verificar que todo esté correctamente configurado.

## 🔍 Paso 1: Verificar SQL

Verifica que el esquema SQL esté sintácticamente correcto:

```bash
pnpm run verify:sql
# o
node scripts/verify-sql.js
```

**Qué verifica:**
- ✅ Todas las tablas están definidas (users, sessions, predictions)
- ✅ Todas las columnas requeridas existen
- ✅ Índices únicos están definidos
- ✅ Sintaxis básica (paréntesis, llaves, comillas balanceadas)
- ✅ Funciones y triggers están definidos

**Si hay errores:**
- Revisa el mensaje de error
- Verifica que no haya comillas o paréntesis sin cerrar
- Asegúrate de que todas las tablas tengan sus columnas

## 🔍 Paso 2: Verificar Variables de Entorno

Verifica que las credenciales estén correctamente formateadas:

```bash
pnpm run verify:env
# o
node scripts/verify-env.js
```

**Qué verifica:**
- ✅ Archivo `.env.local` existe
- ✅ Variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están definidas
- ✅ URL tiene formato correcto (https://...supabase.co)
- ✅ Key tiene formato correcto (JWT que empieza con "eyJ")
- ✅ No son valores de ejemplo

**Si hay errores:**
- Crea el archivo `.env.local` si no existe
- Verifica que las variables tengan los nombres exactos (sin espacios)
- Asegúrate de haber reemplazado los valores de ejemplo con tus credenciales reales

## 🔍 Paso 3: Probar Conexión con Supabase

Prueba la conexión real con Supabase:

```bash
pnpm run test:supabase
# o
node scripts/test-supabase-connection.js
```

**Qué verifica:**
- ✅ Las credenciales son válidas
- ✅ Puede conectarse a Supabase
- ✅ Las tablas existen (si ya ejecutaste el SQL)
- ✅ Los constraints únicos están funcionando

**Si hay errores:**

### Error: "Invalid API key"
- Verifica que copiaste la clave **anon public** completa
- Asegúrate de que no haya espacios o saltos de línea
- Verifica que la clave empiece con "eyJ"

### Error: "does not exist" (tablas)
- Ejecuta el script `db/schema.sql` en Supabase SQL Editor
- Verifica que el script se ejecutó sin errores
- Revisa en "Table Editor" de Supabase que las tablas existan

### Error: "Connection refused" o timeout
- Verifica tu conexión a internet
- Verifica que tu proyecto de Supabase esté activo (no pausado)
- Verifica que la URL sea correcta

## 🚀 Verificación Rápida (Todo Junto)

Para verificar todo de una vez:

```bash
# 1. Verificar SQL y variables de entorno
pnpm run verify:all

# 2. Probar conexión (requiere .env.local configurado)
pnpm run test:supabase
```

## 📋 Checklist Completo

Marca cada paso cuando lo completes:

### SQL
- [ ] Script `verify-sql.js` ejecuta sin errores
- [ ] Todas las tablas están definidas
- [ ] Índices únicos están presentes
- [ ] Funciones están definidas

### Variables de Entorno
- [ ] Archivo `.env.local` existe
- [ ] `NEXT_PUBLIC_SUPABASE_URL` está definida
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` está definida
- [ ] Formato de URL es correcto
- [ ] Formato de Key es correcto
- [ ] No son valores de ejemplo

### Supabase
- [ ] Proyecto creado en Supabase
- [ ] Script SQL ejecutado sin errores
- [ ] Tablas visibles en "Table Editor"
- [ ] Conexión de prueba exitosa
- [ ] Constraints únicos funcionando

### Aplicación
- [ ] `pnpm install` ejecutado
- [ ] `pnpm dev` inicia sin errores
- [ ] Puedo crear un usuario
- [ ] Puedo crear una sesión (admin)
- [ ] Puedo crear una predicción

## 🐛 Solución de Problemas Comunes

### "Cannot find module 'dotenv'"
```bash
pnpm install
```

### "NEXT_PUBLIC_SUPABASE_URL is not defined"
- Verifica que el archivo se llama `.env.local` (con el punto)
- Verifica que está en la raíz del proyecto
- Reinicia el servidor después de crear/modificar `.env.local`

### "relation does not exist"
- Ve a Supabase → SQL Editor
- Ejecuta `db/schema.sql` completo
- Verifica en "Table Editor" que las tablas existan

### "Invalid API key"
- Ve a Supabase → Settings → API
- Copia la clave **anon public** (no la service_role)
- Asegúrate de copiarla completa (son muy largas)

## ✅ Todo Listo?

Si todos los checks pasan:
1. ✅ SQL está correcto
2. ✅ Variables de entorno están bien formateadas
3. ✅ Conexión con Supabase funciona

Entonces puedes ejecutar:
```bash
pnpm dev
```

Y abrir http://localhost:3000 para usar la aplicación!

