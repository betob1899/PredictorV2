-- ============================================
-- Script de Limpieza de Datos de Prueba
-- ============================================
-- 
-- Este script elimina todos los datos de prueba:
-- - Todas las predicciones
-- - Todas las sesiones
-- - Todos los usuarios (excepto administradores)
--
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos!
-- Solo ejecuta esto en desarrollo/pruebas
-- ============================================

-- Eliminar todas las predicciones
DELETE FROM predictions;

-- Eliminar todas las sesiones
DELETE FROM sessions;

-- Eliminar todos los usuarios (excepto los que tienen role='admin')
-- O si quieres eliminar TODOS los usuarios, descomenta la siguiente línea:
-- DELETE FROM users;

-- Eliminar usuarios que NO son administradores
DELETE FROM users WHERE role != 'admin';

-- Verificar que se eliminaron los datos
SELECT 
  (SELECT COUNT(*) FROM predictions) as total_predictions,
  (SELECT COUNT(*) FROM sessions) as total_sessions,
  (SELECT COUNT(*) FROM users WHERE role != 'admin') as total_users;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Limpieza completada!';
  RAISE NOTICE '   - Predicciones eliminadas';
  RAISE NOTICE '   - Sesiones eliminadas';
  RAISE NOTICE '   - Usuarios no-admin eliminados';
END $$;

