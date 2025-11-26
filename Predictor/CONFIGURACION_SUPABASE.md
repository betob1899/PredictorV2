# 🔧 Guía de Configuración de Supabase

Esta guía te llevará paso a paso para configurar Supabase y las variables de entorno.

## 📋 Paso 1: Crear cuenta y proyecto en Supabase

1. **Ve a [supabase.com](https://supabase.com)**
2. **Haz clic en "Start your project"** o "Sign in" si ya tienes cuenta
3. **Crea una cuenta** (puedes usar GitHub, Google, o email)
4. **Crea un nuevo proyecto**:
   - Haz clic en "New Project"
   - **Nombre del proyecto**: `time-predictor` (o el que prefieras)
   - **Database Password**: Crea una contraseña segura (¡guárdala!)
   - **Region**: Elige la más cercana a ti
   - **Pricing Plan**: Free tier está bien para empezar
   - Haz clic en "Create new project"

5. **Espera 2-3 minutos** mientras Supabase configura tu proyecto

## 📋 Paso 2: Ejecutar el esquema SQL

1. **En el dashboard de Supabase**, ve a **SQL Editor** (menú lateral izquierdo)
2. **Haz clic en "New Query"**
3. **Abre el archivo `db/schema.sql`** de este proyecto
4. **Copia TODO el contenido** del archivo
5. **Pega el contenido** en el editor SQL de Supabase
6. **Haz clic en "Run"** o presiona `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

✅ **Verificación**: Deberías ver un mensaje de éxito. Si hay errores, revisa que no haya ejecutado el script antes.

## 📋 Paso 3: Obtener las credenciales

1. **En el dashboard de Supabase**, ve a **Settings** (⚙️ en el menú lateral)
2. **Haz clic en "API"** en el submenú
3. **Encontrarás dos valores importantes**:

   - **Project URL**: 
     - Está en la sección "Project URL"
     - Ejemplo: `https://abcdefghijklmnop.supabase.co`
     - **Copia este valor**

   - **anon public key**:
     - Está en la sección "Project API keys"
     - Busca la clave que dice "anon" y "public"
     - Es una cadena larga que empieza con `eyJ...`
     - **Copia este valor**

## 📋 Paso 4: Crear archivo .env.local

1. **En la raíz de tu proyecto**, crea un archivo llamado `.env.local`
   - Si usas VS Code: Click derecho → New File → `.env.local`
   - Si usas terminal: `touch .env.local` (Mac/Linux) o crear manualmente (Windows)

2. **Abre el archivo `.env.local`** y pega esto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

3. **Reemplaza los valores**:
   - `tu_url_aqui` → Pega el **Project URL** que copiaste
   - `tu_key_aqui` → Pega el **anon public key** que copiaste

**Ejemplo final** (con valores reales):
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzE2ODAwMCwiZXhwIjoxOTYyNzQ0MDAwfQ.abcdefghijklmnopqrstuvwxyz123456789
```

## 📋 Paso 5: Verificar la configuración

1. **Abre el archivo `.env.local`** y verifica que:
   - ✅ No haya espacios alrededor del `=`
   - ✅ No haya comillas alrededor de los valores
   - ✅ Los valores estén completos (sin cortarse)

2. **Reinicia el servidor de desarrollo** si está corriendo:
   - Detén el servidor (Ctrl+C)
   - Ejecuta `pnpm dev` de nuevo

## ✅ Verificación Final

Para verificar que todo funciona:

1. **Ejecuta la aplicación**:
   ```bash
   pnpm dev
   ```

2. **Abre** [http://localhost:3000](http://localhost:3000)

3. **Prueba crear un usuario**:
   - Haz clic en "USER"
   - Llena el formulario
   - Si funciona, verás "PREDICTION SAVED!"

4. **Prueba crear una sesión** (como admin):
   - Haz clic en "ADMIN"
   - Crea una sesión
   - Si funciona, verás la sesión en la lista

## 🐛 Solución de Problemas

### Error: "Failed to create user"
- ✅ Verifica que el archivo `.env.local` existe
- ✅ Verifica que las variables tienen los nombres correctos (sin espacios)
- ✅ Verifica que copiaste las credenciales completas
- ✅ Reinicia el servidor después de crear `.env.local`

### Error: "Invalid API key"
- ✅ Verifica que copiaste la clave **anon public**, no la **service_role**
- ✅ Verifica que la clave está completa (son muy largas)

### Error: "relation does not exist"
- ✅ Verifica que ejecutaste el script SQL en Supabase
- ✅ Ve a "Table Editor" en Supabase y verifica que existen las tablas: `users`, `sessions`, `predictions`

### No se conecta a Supabase
- ✅ Verifica que tu proyecto de Supabase está activo (no pausado)
- ✅ Verifica que la URL de Supabase es correcta
- ✅ Verifica tu conexión a internet

## 📞 ¿Necesitas ayuda?

Si tienes problemas:
1. Revisa la consola del navegador (F12 → Console)
2. Revisa los logs del servidor en la terminal
3. Verifica que las tablas existen en Supabase (Table Editor)

