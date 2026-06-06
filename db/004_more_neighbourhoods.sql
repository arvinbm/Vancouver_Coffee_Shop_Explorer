-- 004_more_neighbourhoods.sql
--
-- Adds neighbourhoods and coffee shops for Burnaby, West Vancouver,
-- North Vancouver, and Surrey.
--
-- Uses subqueries to look up neighbourhood IDs by name instead of
-- hardcoding numbers — safer if IDs ever shift.
--
-- To reset and re-run: docker compose down -v && docker compose up

-- ── Neighbourhoods ────────────────────────────────────────────────────────────

INSERT INTO neighborhoods (name) VALUES
    ('Burnaby Heights'),
    ('Metrotown'),
    ('Brentwood'),
    ('Ambleside'),
    ('Dundarave'),
    ('Lower Lonsdale'),
    ('Central Lonsdale'),
    ('Surrey City Centre'),
    ('White Rock'),
    ('Guildford')
ON CONFLICT (name) DO NOTHING;

-- ── Coffee shops ──────────────────────────────────────────────────────────────

INSERT INTO coffee_shops
    (name, address, neighborhood_id, latitude, longitude, website, phone, google_maps_url)
VALUES

    -- Burnaby Heights
    (
        'JJ Bean Coffee',
        '3456 E Hastings St, Burnaby, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Burnaby Heights'),
        49.280200, -122.980500,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- Metrotown
    (
        'Blenz Coffee',
        '4700 Kingsway, Burnaby, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Metrotown'),
        49.226700, -123.000000,
        'https://blenz.com',
        NULL,
        NULL
    ),

    -- Brentwood
    (
        'Analog Coffee',
        '1635 Burquitlam Plaza, Burnaby, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Brentwood'),
        49.266700, -123.000200,
        NULL,
        NULL,
        NULL
    ),

    -- Ambleside, West Vancouver
    (
        'Savary Island Pie Company',
        '1533 Marine Dr, West Vancouver, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Ambleside'),
        49.326800, -123.161700,
        NULL,
        '604-926-4021',
        NULL
    ),

    -- Dundarave, West Vancouver
    (
        'Bean Around the World',
        '2505 Marine Dr, West Vancouver, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Dundarave'),
        49.333300, -123.190000,
        'https://beanaround.ca',
        NULL,
        NULL
    ),

    -- Lower Lonsdale, North Vancouver
    (
        'Moja Coffee',
        '124 W 1st St, North Vancouver, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Lower Lonsdale'),
        49.310000, -123.073300,
        'https://mojacoffee.com',
        '604-985-5163',
        NULL
    ),

    -- Central Lonsdale, North Vancouver
    (
        'JJ Bean Coffee',
        '1305 Lonsdale Ave, North Vancouver, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Central Lonsdale'),
        49.320000, -123.066700,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- Surrey City Centre
    (
        'Waves Coffee House',
        '13450 104 Ave, Surrey, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Surrey City Centre'),
        49.189500, -122.849400,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- White Rock
    (
        'Coho Coffee',
        '15040 Marine Dr, White Rock, BC',
        (SELECT id FROM neighborhoods WHERE name = 'White Rock'),
        49.021300, -122.803100,
        NULL,
        NULL,
        NULL
    ),

    -- Guildford
    (
        'Waves Coffee House',
        '15355 104 Ave, Surrey, BC',
        (SELECT id FROM neighborhoods WHERE name = 'Guildford'),
        49.183300, -122.800000,
        'https://wavescoffee.com',
        NULL,
        NULL
    );
