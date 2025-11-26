-- ============================================
-- Script de Limpieza de Sesión Específica
-- ============================================
-- 
-- Este script elimina una sesión específica y todas sus predicciones
-- 
-- INSTRUCCIONES:
-- 1. Reemplaza 'SESSION_NAME_HERE' con el nombre de la sesión que quieres eliminar
-- 2. O reemplaza 'SESSION_ID_HERE' con el ID de la sesión
-- ============================================

-- Opción 1: Eliminar por nombre de sesión
-- Reemplaza 'SESSION_NAME_HERE' con el nombre real
DELETE FROM predictions 
WHERE session_id IN (
  SELECT id FROM sessions WHERE name = 'SESSION_NAME_HERE'
);

DELETE FROM sessions WHERE name = 'SESSION_NAME_HERE';

-- Opción 2: Eliminar por ID de sesión (descomenta y usa esta si prefieres)
-- DELETE FROM predictions WHERE session_id = 'SESSION_ID_HERE';
-- DELETE FROM sessions WHERE id = 'SESSION_ID_HERE';

-- Verificar eliminación
SELECT 
  (SELECT COUNT(*) FROM predictions WHERE session_id IN (
    SELECT id FROM sessions WHERE name = 'SESSION_NAME_HERE'
  )) as remaining_predictions,
  (SELECT COUNT(*) FROM sessions WHERE name = 'SESSION_NAME_HERE') as remaining_sessions;

