-- ============================================
-- Fix: Drop and Recreate Triggers
-- ============================================
-- 
-- This script fixes the "trigger already exists" error
-- Run this if you get trigger errors when executing the schema
-- ============================================

-- Drop all existing triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
DROP TRIGGER IF EXISTS update_predictions_updated_at ON predictions;
DROP TRIGGER IF EXISTS update_admin_auth_updated_at ON admin_auth;

-- Recreate triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at BEFORE UPDATE ON predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_auth_updated_at BEFORE UPDATE ON admin_auth
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

