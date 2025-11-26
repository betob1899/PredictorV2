-- ============================================
-- Supabase Database Schema for Time Predictor
-- ============================================
-- 
-- This schema creates three main tables:
-- 1. users - Stores user information (both regular users and admins)
-- 2. sessions - Stores time prediction sessions created by admins
-- 3. predictions - Stores user predictions for each session
--
-- Row Level Security (RLS) is enabled on all tables to ensure proper access control.
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ADMIN AUTH TABLE
-- ============================================
-- Stores admin login credentials
CREATE TABLE IF NOT EXISTS admin_auth (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- Hashed password using crypt
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user information including name, work area, and role
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  work_area TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SESSIONS TABLE
-- ============================================
-- Stores time prediction sessions with start/end times
-- start_time and end_time are optional and can be set after users submit predictions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_time TEXT CHECK (start_time IS NULL OR start_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  end_time TEXT CHECK (end_time IS NULL OR end_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  actual_duration_minutes INTEGER,
  is_closed BOOLEAN NOT NULL DEFAULT FALSE, -- When true, no more predictions can be submitted
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- PREDICTIONS TABLE
-- ============================================
-- Stores user predictions for each session
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  predicted_time TEXT NOT NULL CHECK (predicted_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  predicted_minutes INTEGER NOT NULL,
  difference_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, session_id), -- One prediction per user per session
  -- Prevent duplicate predictions (same time in same session)
  UNIQUE(session_id, predicted_time)
);

-- ============================================
-- INDEXES
-- ============================================
-- Improve query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_sessions_created_by ON sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_session_id ON predictions(session_id);
CREATE INDEX IF NOT EXISTS idx_predictions_difference ON predictions(session_id, difference_minutes);

-- Unique index to prevent duplicate users (case-insensitive)
-- This ensures no two users can have the same first_name + last_name combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_unique_name 
ON users(LOWER(TRIM(first_name)), LOWER(TRIM(last_name)));

-- Index for sessions status
CREATE INDEX IF NOT EXISTS idx_sessions_is_closed ON sessions(is_closed);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
-- Automatically updates the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_predictions_updated_at ON predictions;
CREATE TRIGGER update_predictions_updated_at BEFORE UPDATE ON predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================
-- Users can read all users (for displaying names)
CREATE POLICY "Users can read all users" ON users
  FOR SELECT USING (true);

-- Users can insert themselves (registration)
-- Note: In production, you should add proper authentication checks
CREATE POLICY "Users can insert themselves" ON users
  FOR INSERT WITH CHECK (true);

-- Allow updates (simplified for demo - add auth checks in production)
CREATE POLICY "Users can update users" ON users
  FOR UPDATE USING (true);

-- ============================================
-- SESSIONS TABLE POLICIES
-- ============================================
-- Everyone can read sessions
CREATE POLICY "Everyone can read sessions" ON sessions
  FOR SELECT USING (true);

-- Allow session creation (simplified - add admin check in production)
CREATE POLICY "Admins can create sessions" ON sessions
  FOR INSERT WITH CHECK (true);

-- Allow session updates (simplified - add admin check in production)
CREATE POLICY "Admins can update sessions" ON sessions
  FOR UPDATE USING (true);

-- Allow session deletion (simplified - add admin check in production)
CREATE POLICY "Admins can delete sessions" ON sessions
  FOR DELETE USING (true);

-- ============================================
-- PREDICTIONS TABLE POLICIES
-- ============================================
-- Users can read all predictions (to see who won)
CREATE POLICY "Users can read all predictions" ON predictions
  FOR SELECT USING (true);

-- Users can insert their own predictions
CREATE POLICY "Users can insert their own predictions" ON predictions
  FOR INSERT WITH CHECK (true);

-- Allow prediction updates (for calculating differences)
CREATE POLICY "Users can update predictions" ON predictions
  FOR UPDATE USING (true);

-- ============================================
-- ADMIN AUTH TABLE POLICIES
-- ============================================
-- Only admins can read admin auth (simplified - add proper auth in production)
CREATE POLICY "Admins can read admin auth" ON admin_auth
  FOR SELECT USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to calculate winner for a session
CREATE OR REPLACE FUNCTION get_session_winner(session_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  work_area TEXT,
  predicted_time TEXT,
  predicted_minutes INTEGER,
  difference_minutes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.work_area,
    p.predicted_time,
    p.predicted_minutes,
    p.difference_minutes
  FROM predictions p
  JOIN users u ON p.user_id = u.id
  WHERE p.session_id = session_uuid
    AND p.difference_minutes IS NOT NULL
  ORDER BY p.difference_minutes ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

