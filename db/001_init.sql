-- 001_init.sql
--
-- This file runs automatically when the postgres container starts for the first time
-- (because it's mounted into /docker-entrypoint-initdb.d/).
-- Files in that directory run in alphabetical order, so prefix with numbers: 001_, 002_, etc.
--
-- To reset and re-run: docker compose down -v && docker compose up

-- ── Neighborhoods lookup table ────────────────────────────────────────────────
-- Keeps neighborhood names in one place. coffee_shops references it via foreign key.
-- This is the "normalize" part of a normalized schema — we don't repeat the string
-- "Kitsilano" in every row; we store an integer ID instead.
CREATE TABLE IF NOT EXISTS neighborhoods (
    id   SERIAL      PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ── Core coffee shops table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coffee_shops (
    id              SERIAL          PRIMARY KEY,

    -- Basic info
    name            VARCHAR(255)    NOT NULL,
    address         VARCHAR(255),

    -- Foreign key into neighborhoods. ON DELETE SET NULL means if a neighborhood
    -- row is deleted, this column becomes NULL rather than throwing an error.
    neighborhood_id INTEGER         REFERENCES neighborhoods(id) ON DELETE SET NULL,

    -- Geospatial coordinates. NUMERIC(9,6) stores up to 3 digits before the decimal
    -- and 6 after — enough precision for ~10cm accuracy, which is overkill but correct.
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),

    -- Optional metadata
    website         VARCHAR(255),
    phone           VARCHAR(30),
    google_maps_url VARCHAR(500),

    -- Timestamps — useful for knowing when data was added/updated
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
-- An index speeds up queries that filter or sort on a column, at the cost of
-- slightly slower writes (Postgres has to update the index on every INSERT/UPDATE).
-- Rule of thumb: index columns you WHERE or JOIN on frequently.

-- Filter coffee shops by neighborhood (very common query)
CREATE INDEX IF NOT EXISTS idx_coffee_shops_neighborhood
    ON coffee_shops(neighborhood_id);

-- Range queries on coordinates (e.g., "shops within bounding box")
-- A composite index covers both columns when you filter on lat AND lng together.
CREATE INDEX IF NOT EXISTS idx_coffee_shops_location
    ON coffee_shops(latitude, longitude);

-- Seed data lives in 003_seed.sql to keep schema and data separate.
