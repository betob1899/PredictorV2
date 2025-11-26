-- ============================================
-- Migration: Add Admin Auth and Update Sessions
-- ============================================
-- 
-- This migration:
-- 1. Adds admin_auth table for admin login
-- 2. Updates sessions table to make times optional and add is_closed
-- 3. Creates default admin user
--
-- Run this if you already have a database
-- ============================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin_auth table
CREATE TABLE IF NOT EXISTS admin_auth (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Update sessions table to make times optional
ALTER TABLE sessions 
  ALTER COLUMN start_time DROP NOT NULL,
  ALTER COLUMN end_time DROP NOT NULL,
  ALTER COLUMN actual_duration_minutes DROP NOT NULL;

-- Add is_closed column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sessions' AND column_name = 'is_closed'
  ) THEN
    ALTER TABLE sessions ADD COLUMN is_closed BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- Add index for sessions status
CREATE INDEX IF NOT EXISTS idx_sessions_is_closed ON sessions(is_closed);

-- Add RLS policy for admin_auth
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin auth" ON admin_auth
  FOR SELECT USING (true);

-- Create default admin user (username: admin, password: admin123)
-- IMPORTANT: Change this password in production!
INSERT INTO admin_auth (username, password_hash)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Add trigger for updated_at on admin_auth
DROP TRIGGER IF EXISTS update_admin_auth_updated_at ON admin_auth;
CREATE TRIGGER update_admin_auth_updated_at BEFORE UPDATE ON admin_auth
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

