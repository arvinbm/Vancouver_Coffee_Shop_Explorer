-- 002_users_reviews.sql
--
-- Creates the users and reviews tables.
-- Runs automatically after 001_init.sql on first boot because files in
-- /docker-entrypoint-initdb.d/ are executed in alphabetical/filename order.
--
-- To reset and re-run: docker compose down -v && docker compose up

-- ── Users table ───────────────────────────────────────────────────────────────
-- Stores account credentials. Passwords are never stored in plain text —
-- only the bcrypt hash is stored. The application compares hashes at login.
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL        PRIMARY KEY,
    username      VARCHAR(50)   NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index on username — every login query looks up by username, so this
-- avoids a full table scan on every login attempt.
CREATE INDEX IF NOT EXISTS idx_users_username
    ON users(username);

-- ── Reviews table ─────────────────────────────────────────────────────────────
-- Each row is one review left by one user on one coffee shop.
--
-- ON DELETE SET NULL on both foreign keys means:
--   - If a user is deleted, their reviews survive with user_id set to NULL.
--   - If a coffee shop is deleted, its reviews survive with coffee_shop_id set to NULL.
-- This preserves review content even when the referenced row is removed.
--
-- Both columns are nullable (no NOT NULL) to allow SET NULL to work.
CREATE TABLE IF NOT EXISTS reviews (
    id              SERIAL      PRIMARY KEY,

    -- Foreign keys — nullable to support ON DELETE SET NULL
    user_id         INTEGER     REFERENCES users(id)        ON DELETE SET NULL,
    coffee_shop_id  INTEGER     REFERENCES coffee_shops(id) ON DELETE SET NULL,

    -- Rating must be a whole number between 1 and 5 inclusive.
    -- CHECK is enforced by the database — the backend cannot insert an invalid value.
    rating          INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),

    -- The written review body. TEXT has no length limit in Postgres.
    -- Nullable — a user might want to leave a star rating without a written review.
    body            TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevents a user from reviewing the same shop more than once.
    -- Note: NULL values are never considered equal in a UNIQUE constraint,
    -- so reviews with a NULL user_id (deleted accounts) won't conflict here.
    CONSTRAINT unique_user_review UNIQUE (user_id, coffee_shop_id)
);

-- Index on coffee_shop_id — the most common query is "get all reviews for this shop".
CREATE INDEX IF NOT EXISTS idx_reviews_coffee_shop
    ON reviews(coffee_shop_id);

-- Index on user_id — useful for "get all reviews by this user" queries.
CREATE INDEX IF NOT EXISTS idx_reviews_user
    ON reviews(user_id);

-- ── Prevent duplicate coffee shops ───────────────────────────────────────────
-- Adds a UNIQUE constraint on coffee_shops.name so the database rejects
-- an insert if a shop with the same name already exists.
-- IF NOT EXISTS is not supported for constraints, so we use DO $$ ... $$ to
-- check first and avoid an error if this file is somehow run twice.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_shop_name'
    ) THEN
        ALTER TABLE coffee_shops ADD CONSTRAINT unique_shop_name UNIQUE (name);
    END IF;
END $$;
