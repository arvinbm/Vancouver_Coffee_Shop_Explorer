-- 002_users_reviews.sql
--
-- Creates the users and reviews tables.
-- Runs automatically after 001_init.sql on first boot because files in
-- /docker-entrypoint-initdb.d/ are executed in alphabetical/filename order.
--
-- To reset and re-run: docker compose down -v && docker compose up

-- ── Users table ───────────────────────────────────────────────────────────────
-- Stores account credentials.
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
CREATE TABLE IF NOT EXISTS reviews (
    id              SERIAL      PRIMARY KEY,

    -- Foreign keys — nullable to support ON DELETE SET NULL
    user_id         INTEGER     REFERENCES users(id)        ON DELETE SET NULL,
    coffee_shop_id  INTEGER     REFERENCES coffee_shops(id) ON DELETE SET NULL,

    -- Rating must be a whole number between 1 and 5 inclusive.
    rating          INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),

    -- The written review body. TEXT has no length limit in Postgres.
    body            TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevents a user from reviewing the same shop more than once.
    CONSTRAINT unique_user_review UNIQUE (user_id, coffee_shop_id)
);

-- Index on coffee_shop_id — the most common query is "get all reviews for this shop".
CREATE INDEX IF NOT EXISTS idx_reviews_coffee_shop
    ON reviews(coffee_shop_id);

-- Index on user_id — useful for "get all reviews by this user" queries.
CREATE INDEX IF NOT EXISTS idx_reviews_user
    ON reviews(user_id);

-- ── Prevent duplicate coffee shops via Google Place ID ───────────────────────
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'coffee_shops' AND column_name = 'google_place_id'
    ) THEN
        ALTER TABLE coffee_shops ADD COLUMN google_place_id VARCHAR(255) UNIQUE;
    END IF;
END $$;
