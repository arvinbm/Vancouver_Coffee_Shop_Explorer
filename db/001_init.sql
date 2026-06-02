-- 001_init.sql
--
-- This file runs automatically when the postgres container starts for the first time
-- (because it's mounted into /docker-entrypoint-initdb.d/).
--
-- To reset and re-run: docker compose down -v && docker compose up

-- ── Neighborhoods lookup table ────────────────────────────────────────────────
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

    -- Geospatial coordinates.
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
-- Filter coffee shops by neighborhood (very common query)
CREATE INDEX IF NOT EXISTS idx_coffee_shops_neighborhood
    ON coffee_shops(neighborhood_id);

-- Range queries on coordinates
CREATE INDEX IF NOT EXISTS idx_coffee_shops_location
    ON coffee_shops(latitude, longitude);

