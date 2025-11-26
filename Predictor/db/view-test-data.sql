-- ============================================
-- Script para Ver Datos de Prueba
-- ============================================
-- 
-- Este script muestra todos los datos actuales
-- Úsalo antes de limpiar para ver qué hay
-- ============================================

-- Ver todas las sesiones
SELECT 
  id,
  name,
  start_time,
  end_time,
  is_closed,
  created_at
FROM sessions
ORDER BY created_at DESC;

-- Ver todos los usuarios
SELECT 
  id,
  first_name,
  last_name,
  work_area,
  role,
  created_at
FROM users
ORDER BY created_at DESC;

-- Ver todas las predicciones con información del usuario
SELECT 
  p.id,
  u.first_name || ' ' || u.last_name as usuario,
  s.name as sesion,
  p.predicted_time,
  p.predicted_minutes,
  p.difference_minutes,
  p.created_at
FROM predictions p
JOIN users u ON p.user_id = u.id
JOIN sessions s ON p.session_id = s.id
ORDER BY p.created_at DESC;

-- Resumen de datos
SELECT 
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM users WHERE role = 'admin') as usuarios_admin,
  (SELECT COUNT(*) FROM users WHERE role = 'user') as usuarios_normales,
  (SELECT COUNT(*) FROM sessions) as total_sesiones,
  (SELECT COUNT(*) FROM sessions WHERE is_closed = true) as sesiones_cerradas,
  (SELECT COUNT(*) FROM sessions WHERE is_closed = false) as sesiones_abiertas,
  (SELECT COUNT(*) FROM predictions) as total_predicciones;

