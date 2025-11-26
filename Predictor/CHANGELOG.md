# Changelog

## [1.1.0] - Validación de Duplicados

### ✨ Nuevas Funcionalidades

- **Validación de usuarios duplicados**: 
  - No se puede registrar el mismo usuario (mismo nombre + apellido) dos veces
  - Validación case-insensitive (ignora mayúsculas/minúsculas)
  - Mensaje de error claro: "El usuario [Nombre] [Apellido] ya existe"

- **Validación de predicciones duplicadas**:
  - No se puede ingresar la misma predicción de tiempo para la misma sesión
  - Si otro usuario ya ingresó ese tiempo, se muestra un mensaje indicando quién lo hizo
  - Mensaje de error: "La predicción [HH:MM] ya fue ingresada por otro usuario ([Nombre])"

### 🔧 Cambios Técnicos

- Agregado índice único en tabla `users` para prevenir duplicados
- Agregado constraint único en tabla `predictions` para `(session_id, predicted_time)`
- Mejorada validación en `app/actions/users.ts` para verificar duplicados antes de insertar
- Mejorada validación en `app/actions/predictions.ts` para verificar predicciones duplicadas
- Mensajes de error en español para mejor experiencia de usuario

### 📝 Migración

Si ya tienes una base de datos existente, ejecuta:
```sql
-- Ver archivo: db/migration-add-unique-constraints.sql
```

O ejecuta el script completo `db/schema.sql` de nuevo (es seguro, usa `IF NOT EXISTS`).

### 🐛 Correcciones

- Validación de usuarios ahora es case-insensitive
- Mejor manejo de errores de constraint violations
- Mensajes de error más descriptivos y en español

