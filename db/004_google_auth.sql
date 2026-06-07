-- 004_google_auth.sql
--
-- Adds Google OAuth support to the users table.
-- password_hash becomes nullable so Google users don't need a password.
-- google_id stores the unique ID Google gives each user.

ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
