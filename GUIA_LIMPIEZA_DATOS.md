# 🧹 Guía de Limpieza de Datos de Prueba

Esta guía te ayudará a limpiar datos de prueba de tu base de datos Supabase.

## 📋 Scripts Disponibles

### 1. Ver Datos Actuales
**Archivo**: `db/view-test-data.sql`

Antes de limpiar, siempre es bueno ver qué datos tienes:

```sql
-- Ejecuta en Supabase SQL Editor
-- Muestra todas las sesiones, usuarios y predicciones
```

**Qué muestra:**
- Lista de todas las sesiones
- Lista de todos los usuarios
- Lista de todas las predicciones con detalles
- Resumen con conteos

### 2. Limpiar Datos de Prueba (Recomendado)
**Archivo**: `db/cleanup-test-data.sql`

Elimina datos de prueba pero mantiene:
- ✅ Usuarios administradores
- ✅ Credenciales de admin_auth

**Qué elimina:**
- ❌ Todas las predicciones
- ❌ Todas las sesiones
- ❌ Todos los usuarios NO administradores

**Cuándo usar:**
- Cuando quieres limpiar pruebas pero mantener la configuración de admin
- Antes de hacer una nueva ronda de pruebas
- Para resetear el estado de la aplicación

### 3. Limpieza Completa
**Archivo**: `db/cleanup-all-data.sql`

⚠️ **ADVERTENCIA**: Elimina TODO excepto `admin_auth`

**Qué elimina:**
- ❌ Todas las predicciones
- ❌ Todas las sesiones
- ❌ TODOS los usuarios (incluyendo admins de la tabla users)

**Qué mantiene:**
- ✅ Credenciales de `admin_auth` (puedes seguir haciendo login)

**Cuándo usar:**
- Cuando quieres empezar completamente desde cero
- Después de pruebas extensivas
- Para resetear todo el sistema

### 4. Limpiar Sesión Específica
**Archivo**: `db/cleanup-specific-session.sql`

Elimina una sesión específica y todas sus predicciones.

**Cómo usar:**
1. Abre el archivo
2. Reemplaza `'SESSION_NAME_HERE'` con el nombre de la sesión
3. O usa el ID de la sesión
4. Ejecuta en Supabase SQL Editor

## 🚀 Pasos Recomendados

### Para Limpiar Datos de Prueba:

1. **Ver qué hay** (opcional pero recomendado):
   ```sql
   -- Ejecuta: db/view-test-data.sql
   ```

2. **Limpiar datos de prueba**:
   ```sql
   -- Ejecuta: db/cleanup-test-data.sql
   ```

3. **Verificar que se limpió**:
   ```sql
   -- Ejecuta: db/view-test-data.sql de nuevo
   ```

### Para Empezar Desde Cero:

1. **Ver qué hay**:
   ```sql
   -- Ejecuta: db/view-test-data.sql
   ```

2. **Limpiar TODO**:
   ```sql
   -- Ejecuta: db/cleanup-all-data.sql
   ```

3. **Verificar**:
   ```sql
   -- Ejecuta: db/view-test-data.sql
   -- Deberías ver solo admin_auth
   ```

## 📝 Ejemplos de Uso

### Ejemplo 1: Limpiar después de pruebas
```sql
-- 1. Ver datos
SELECT COUNT(*) FROM predictions;  -- Ver cuántas hay

-- 2. Limpiar
DELETE FROM predictions;
DELETE FROM sessions;
DELETE FROM users WHERE role != 'admin';

-- 3. Verificar
SELECT COUNT(*) FROM predictions;  -- Debería ser 0
```

### Ejemplo 2: Eliminar una sesión específica
```sql
-- Eliminar sesión "Prueba 1" y sus predicciones
DELETE FROM predictions 
WHERE session_id IN (
  SELECT id FROM sessions WHERE name = 'Prueba 1'
);
DELETE FROM sessions WHERE name = 'Prueba 1';
```

### Ejemplo 3: Eliminar usuarios de prueba
```sql
-- Eliminar usuarios con nombres de prueba
DELETE FROM users 
WHERE first_name LIKE 'Test%' 
   OR first_name LIKE 'Prueba%'
   OR last_name LIKE 'Test%';
```

## ⚠️ Precauciones

1. **Siempre verifica antes de eliminar**:
   - Usa `view-test-data.sql` primero
   - Asegúrate de que estás eliminando lo correcto

2. **Backup (si es necesario)**:
   - Si tienes datos importantes, exporta antes de limpiar
   - En Supabase: Table Editor → Export data

3. **En producción**:
   - ⚠️ NUNCA ejecutes estos scripts en producción
   - Solo úsalos en desarrollo/pruebas

## 🔄 Después de Limpiar

Después de limpiar los datos:

1. **Verifica que la aplicación funciona**:
   - Intenta crear una nueva sesión
   - Intenta crear un nuevo usuario
   - Verifica que el login de admin funciona

2. **Si algo no funciona**:
   - Verifica que `admin_auth` tenga el usuario admin
   - Si falta, ejecuta `db/migration-add-admin-auth.sql` de nuevo

## 💡 Tips

- **Limpia regularmente**: Mantén la base de datos limpia durante desarrollo
- **Usa nombres descriptivos**: Así es más fácil identificar qué eliminar
- **Guarda scripts útiles**: Crea tus propios scripts para casos específicos

## 🆘 Problemas Comunes

### "No puedo hacer login después de limpiar"
- Verifica que `admin_auth` tenga el usuario admin
- Ejecuta: `INSERT INTO admin_auth (username, password_hash) VALUES ('admin', 'admin123') ON CONFLICT DO NOTHING;`

### "Sigue apareciendo una sesión"
- Verifica que realmente se eliminó: `SELECT * FROM sessions WHERE name = 'NOMBRE';`
- Si aparece, elimínala manualmente

### "No puedo crear usuarios después de limpiar"
- Verifica que las tablas existan: `SELECT * FROM users LIMIT 1;`
- Si hay error, verifica que el schema esté correcto

