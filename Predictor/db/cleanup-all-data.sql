-- ============================================
-- Script de Limpieza COMPLETA
-- ============================================
-- 
-- ⚠️ ADVERTENCIA EXTREMA: Esto eliminará TODOS los datos!
-- - Todas las predicciones
-- - Todas las sesiones
-- - TODOS los usuarios (incluyendo admins)
-- - Mantiene solo admin_auth (credenciales de login)
--
-- Solo ejecuta esto si quieres empezar desde cero
-- ============================================

-- Eliminar todas las predicciones
DELETE FROM predictions;

-- Eliminar todas las sesiones
DELETE FROM sessions;

-- Eliminar TODOS los usuarios
DELETE FROM users;

-- Verificar que se eliminaron los datos
SELECT 
  (SELECT COUNT(*) FROM predictions) as total_predictions,
  (SELECT COUNT(*) FROM sessions) as total_sessions,
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM admin_auth) as total_admin_auth;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Limpieza COMPLETA realizada!';
  RAISE NOTICE '   - Todas las predicciones eliminadas';
  RAISE NOTICE '   - Todas las sesiones eliminadas';
  RAISE NOTICE '   - Todos los usuarios eliminados';
  RAISE NOTICE '   - admin_auth se mantiene (credenciales de login)';
END $$;

