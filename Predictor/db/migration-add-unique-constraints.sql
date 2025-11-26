-- ============================================
-- Migration: Add Unique Constraints
-- ============================================
-- 
-- This migration adds unique constraints to prevent:
-- 1. Duplicate users (same first_name + last_name)
-- 2. Duplicate predictions (same predicted_time in same session)
--
-- Run this if you already have a database and need to add these constraints
-- ============================================

-- Add unique index for users (case-insensitive, trimmed)
-- This prevents duplicate users with the same first_name + last_name
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_unique_name 
ON users(LOWER(TRIM(first_name)), LOWER(TRIM(last_name)));

-- Add unique constraint for predictions (same time in same session)
-- This prevents multiple users from having the same predicted_time in the same session
-- Note: This constraint already exists in the main schema, but adding it here for migration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'predictions_session_id_predicted_time_key'
  ) THEN
    ALTER TABLE predictions 
    ADD CONSTRAINT predictions_session_id_predicted_time_key 
    UNIQUE(session_id, predicted_time);
  END IF;
END $$;

-- Verify constraints were created
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename IN ('users', 'predictions')
  AND indexname LIKE '%unique%'
ORDER BY tablename, indexname;

