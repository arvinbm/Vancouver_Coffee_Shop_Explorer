-- 003_seed.sql
--
-- Seeds the database with 50 neighbourhoods across Greater Vancouver
-- and one popular coffee shop per neighbourhood.
--
-- Runs automatically after 001_init.sql and 002_users_reviews.sql on first boot.
-- To reset and re-run: docker compose down -v && docker compose up

-- ── Neighbourhoods ────────────────────────────────────────────────────────────
-- Inserted in a fixed order so their SERIAL ids are predictable.
-- The coffee shop INSERTs below reference these ids directly.

INSERT INTO neighborhoods (name) VALUES
    ('Kitsilano'),           -- 1
    ('Mount Pleasant'),      -- 2
    ('Commercial Drive'),    -- 3
    ('Downtown'),            -- 4
    ('Gastown'),             -- 5
    ('Yaletown'),            -- 6
    ('Main Street'),         -- 7
    ('Fairview'),            -- 8
    ('West End'),            -- 9
    ('Coal Harbour'),        -- 10
    ('Strathcona'),          -- 11
    ('Chinatown'),           -- 12
    ('South Granville'),     -- 13
    ('Kerrisdale'),          -- 14
    ('Dunbar'),              -- 15
    ('Point Grey'),          -- 16
    ('Hastings-Sunrise'),    -- 17
    ('Grandview-Woodland'),  -- 18
    ('Olympic Village'),     -- 19
    ('Cambie Village'),      -- 20
    ('Burnaby Heights'),     -- 21
    ('Metrotown'),           -- 22
    ('Brentwood'),           -- 23
    ('Ambleside'),           -- 24
    ('Dundarave'),           -- 25
    ('Lower Lonsdale'),      -- 26
    ('Central Lonsdale'),    -- 27
    ('Surrey City Centre'),  -- 28
    ('White Rock'),          -- 29
    ('Guildford'),           -- 30
    ('Coquitlam Centre'),    -- 31
    ('Richmond Centre'),     -- 32
    ('Port Coquitlam'),      -- 33
    ('Port Moody'),          -- 34
    ('New Westminster'),     -- 35
    ('Langley City'),        -- 36
    ('Willowbrook'),         -- 37
    ('Ladner'),              -- 38
    ('Tsawwassen'),          -- 39
    ('Maple Ridge'),         -- 40
    ('Pitt Meadows'),        -- 41
    ('Abbotsford'),          -- 42
    ('Mission'),             -- 43
    ('Deep Cove'),           -- 44
    ('Lynn Valley'),         -- 45
    ('Marpole'),             -- 46
    ('Renfrew-Collingwood'), -- 47
    ('UBC'),                 -- 48
    ('Steveston'),           -- 49
    ('Cloverdale')           -- 50
ON CONFLICT (name) DO NOTHING;

-- ── Coffee shops ──────────────────────────────────────────────────────────────
-- One popular shop per neighbourhood.

INSERT INTO coffee_shops
    (name, address, neighborhood_id, latitude, longitude, website, phone, google_maps_url)
VALUES

    -- 1. Kitsilano
    (
        '49th Parallel Coffee',
        '2198 W 4th Ave, Vancouver, BC',
        1,
        49.267300, -123.155400,
        'https://49thcoffee.com',
        '604-420-4900',
        'https://maps.app.goo.gl/49thParallelKits'
    ),

    -- 2. Mount Pleasant
    (
        'Prototype Coffee',
        '820 E Broadway, Vancouver, BC',
        2,
        49.262900, -123.080900,
        NULL,
        NULL,
        'https://maps.app.goo.gl/PrototypeMtPleasant'
    ),

    -- 3. Commercial Drive
    (
        'Prado Cafe',
        '1938 Commercial Dr, Vancouver, BC',
        3,
        49.266000, -123.069400,
        'https://pradocafe.ca',
        '604-255-5537',
        'https://maps.app.goo.gl/PradoCommercialDr'
    ),

    -- 4. Downtown
    (
        'Nemesis Coffee',
        '1030 W Georgia St, Vancouver, BC',
        4,
        49.284900, -123.124100,
        'https://nemesiscoffee.com',
        NULL,
        'https://maps.app.goo.gl/NemesisDowntown'
    ),

    -- 5. Gastown
    (
        'Revolver Coffee',
        '325 Cambie St, Vancouver, BC',
        5,
        49.283600, -123.108900,
        'https://revolvercoffee.ca',
        '604-558-4444',
        'https://maps.app.goo.gl/RevolverGastown'
    ),

    -- 6. Yaletown
    (
        'Elysian Coffee',
        '1100 Hamilton St, Vancouver, BC',
        6,
        49.275700, -123.123500,
        'https://elysiancoffee.ca',
        NULL,
        'https://maps.app.goo.gl/ElysianYaletown'
    ),

    -- 7. Main Street
    (
        'Matchstick Coffee',
        '639 Main St, Vancouver, BC',
        7,
        49.278400, -123.100300,
        'https://matchstickyvr.com',
        NULL,
        'https://maps.app.goo.gl/MatchstickMain'
    ),

    -- 8. Fairview
    (
        'Caffe Artigiano',
        '1101 W Broadway, Vancouver, BC',
        8,
        49.263500, -123.137800,
        'https://caffeartigiano.com',
        '604-874-0589',
        'https://maps.app.goo.gl/ArtigianoFairview'
    ),

    -- 9. West End
    (
        'Melriches Coffeehouse',
        '1244 Davie St, Vancouver, BC',
        9,
        49.281300, -123.136800,
        NULL,
        '604-689-5282',
        'https://maps.app.goo.gl/MelrichesWestEnd'
    ),

    -- 10. Coal Harbour
    (
        'Waves Coffee House',
        '401 W Georgia St, Vancouver, BC',
        10,
        49.286200, -123.119400,
        'https://wavescoffee.com',
        NULL,
        'https://maps.app.goo.gl/WavesCoalHarbour'
    ),

    -- 11. Strathcona
    (
        'JJ Bean Coffee',
        '100 E Hastings St, Vancouver, BC',
        11,
        49.281700, -123.097800,
        'https://jjbeancoffee.com',
        NULL,
        'https://maps.app.goo.gl/JJBeanStrathcona'
    ),

    -- 12. Chinatown
    (
        'Matchstick Coffee',
        '213 E Georgia St, Vancouver, BC',
        12,
        49.279700, -123.101700,
        'https://matchstickyvr.com',
        NULL,
        'https://maps.app.goo.gl/MatchstickChinatown'
    ),

    -- 13. South Granville
    (
        'Caffe Artigiano',
        '1301 Granville St, Vancouver, BC',
        13,
        49.258000, -123.138500,
        'https://caffeartigiano.com',
        NULL,
        'https://maps.app.goo.gl/ArtigianoSouthGran'
    ),

    -- 14. Kerrisdale
    (
        'JJ Bean Coffee',
        '2180 W 41st Ave, Vancouver, BC',
        14,
        49.233900, -123.155400,
        'https://jjbeancoffee.com',
        NULL,
        'https://maps.app.goo.gl/JJBeanKerrisdale'
    ),

    -- 15. Dunbar
    (
        'Blenz Coffee',
        '3590 Dunbar St, Vancouver, BC',
        15,
        49.248900, -123.181000,
        'https://blenz.com',
        NULL,
        'https://maps.app.goo.gl/BlenzDunbar'
    ),

    -- 16. Point Grey
    (
        'Savary Island Pie Company',
        '3912 W 10th Ave, Vancouver, BC',
        16,
        49.268000, -123.192800,
        NULL,
        '604-822-2253',
        'https://maps.app.goo.gl/SavaryPointGrey'
    ),

    -- 17. Hastings-Sunrise
    (
        'JJ Bean Coffee',
        '2614 E Hastings St, Vancouver, BC',
        17,
        49.280200, -123.036700,
        'https://jjbeancoffee.com',
        NULL,
        'https://maps.app.goo.gl/JJBeanHastings'
    ),

    -- 18. Grandview-Woodland
    (
        'JJ Bean Coffee',
        '2695 Commercial Dr, Vancouver, BC',
        18,
        49.271200, -123.069400,
        'https://jjbeancoffee.com',
        NULL,
        'https://maps.app.goo.gl/JJBeanGrandview'
    ),

    -- 19. Olympic Village
    (
        'Waves Coffee House',
        '150 W 2nd Ave, Vancouver, BC',
        19,
        49.271600, -123.107500,
        'https://wavescoffee.com',
        NULL,
        'https://maps.app.goo.gl/WavesOlympicVillage'
    ),

    -- 20. Cambie Village
    (
        'Milano Coffee Roasters',
        '156 W 8th Ave, Vancouver, BC',
        20,
        49.263600, -123.114800,
        'https://milanocoffee.ca',
        '604-877-6662',
        'https://maps.app.goo.gl/MilanoCambie'
    ),

    -- 21. Burnaby Heights
    (
        'JJ Bean Coffee',
        '3456 E Hastings St, Burnaby, BC',
        21,
        49.280200, -122.980500,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- 22. Metrotown
    (
        'Blenz Coffee',
        '4700 Kingsway, Burnaby, BC',
        22,
        49.226700, -123.000000,
        'https://blenz.com',
        NULL,
        NULL
    ),

    -- 23. Brentwood
    (
        'Analog Coffee',
        '1635 Burquitlam Plaza, Burnaby, BC',
        23,
        49.266700, -123.000200,
        NULL,
        NULL,
        NULL
    ),

    -- 24. Ambleside
    (
        'Savary Island Pie Company',
        '1533 Marine Dr, West Vancouver, BC',
        24,
        49.326800, -123.161700,
        NULL,
        '604-926-4021',
        NULL
    ),

    -- 25. Dundarave
    (
        'Bean Around the World',
        '2505 Marine Dr, West Vancouver, BC',
        25,
        49.333300, -123.190000,
        'https://beanaround.ca',
        NULL,
        NULL
    ),

    -- 26. Lower Lonsdale
    (
        'Moja Coffee',
        '124 W 1st St, North Vancouver, BC',
        26,
        49.310000, -123.073300,
        'https://mojacoffee.com',
        '604-985-5163',
        NULL
    ),

    -- 27. Central Lonsdale
    (
        'JJ Bean Coffee',
        '1305 Lonsdale Ave, North Vancouver, BC',
        27,
        49.320000, -123.066700,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- 28. Surrey City Centre
    (
        'Waves Coffee House',
        '13450 104 Ave, Surrey, BC',
        28,
        49.189500, -122.849400,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 29. White Rock
    (
        'Coho Coffee',
        '15040 Marine Dr, White Rock, BC',
        29,
        49.021300, -122.803100,
        NULL,
        NULL,
        NULL
    ),

    -- 30. Guildford
    (
        'Waves Coffee House',
        '15355 104 Ave, Surrey, BC',
        30,
        49.183300, -122.800000,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 31. Coquitlam Centre
    (
        'Waves Coffee House',
        '2929 Barnet Hwy, Coquitlam, BC',
        31,
        49.284000, -122.792000,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 32. Richmond Centre
    (
        'JJ Bean Coffee',
        '6551 No 3 Rd, Richmond, BC',
        32,
        49.166700, -123.133300,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- 33. Port Coquitlam
    (
        'Waves Coffee House',
        '2755 Lougheed Hwy, Port Coquitlam, BC',
        33,
        49.262000, -122.781000,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 34. Port Moody
    (
        'Relay Coffee Roasters',
        '2306 St Johns St, Port Moody, BC',
        34,
        49.283000, -122.833000,
        NULL,
        NULL,
        NULL
    ),

    -- 35. New Westminster
    (
        'JJ Bean Coffee',
        '810 Quayside Dr, New Westminster, BC',
        35,
        49.205700, -122.911000,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- 36. Langley City
    (
        'Blenz Coffee',
        '20159 Fraser Hwy, Langley, BC',
        36,
        49.100000, -122.660000,
        'https://blenz.com',
        NULL,
        NULL
    ),

    -- 37. Willowbrook
    (
        'Waves Coffee House',
        '19705 Fraser Hwy, Langley, BC',
        37,
        49.130000, -122.650000,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 38. Ladner
    (
        'Waves Coffee House',
        '4900 Delta St, Delta, BC',
        38,
        49.090000, -123.080000,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 39. Tsawwassen
    (
        'Blenz Coffee',
        '5000 Canoe Pass Way, Tsawwassen, BC',
        39,
        49.016700, -123.080000,
        'https://blenz.com',
        NULL,
        NULL
    ),

    -- 40. Maple Ridge
    (
        'Waves Coffee House',
        '22728 Lougheed Hwy, Maple Ridge, BC',
        40,
        49.219000, -122.598000,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 41. Pitt Meadows
    (
        'Blenz Coffee',
        '19150 Lougheed Hwy, Pitt Meadows, BC',
        41,
        49.221000, -122.689000,
        'https://blenz.com',
        NULL,
        NULL
    ),

    -- 42. Abbotsford
    (
        'JJ Bean Coffee',
        '2070 Abbotsford Way, Abbotsford, BC',
        42,
        49.050000, -122.300000,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- 43. Mission
    (
        'Waves Coffee House',
        '32555 London Ave, Mission, BC',
        43,
        49.133000, -122.300000,
        'https://wavescoffee.com',
        NULL,
        NULL
    ),

    -- 44. Deep Cove
    (
        'Honey Doughnuts & Goodies',
        '4373 Gallant Ave, North Vancouver, BC',
        44,
        49.326700, -122.948300,
        NULL,
        '604-929-4666',
        NULL
    ),

    -- 45. Lynn Valley
    (
        'JJ Bean Coffee',
        '1199 Lynn Valley Rd, North Vancouver, BC',
        45,
        49.346700, -123.023300,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- 46. Marpole
    (
        'Elysian Coffee',
        '8573 Granville St, Vancouver, BC',
        46,
        49.210000, -123.130000,
        'https://elysiancoffee.ca',
        NULL,
        NULL
    ),

    -- 47. Renfrew-Collingwood
    (
        'JJ Bean Coffee',
        '3375 Kingsway, Vancouver, BC',
        47,
        49.240000, -123.040000,
        'https://jjbeancoffee.com',
        NULL,
        NULL
    ),

    -- 48. UBC
    (
        'Agora Cafe',
        '6138 Student Union Blvd, Vancouver, BC',
        48,
        49.260600, -123.246000,
        NULL,
        NULL,
        NULL
    ),

    -- 49. Steveston
    (
        'Steveston Coffee Company',
        '3711 Chatham St, Richmond, BC',
        49,
        49.126700, -123.183300,
        NULL,
        '604-271-0505',
        NULL
    ),

    -- 50. Cloverdale
    (
        'Waves Coffee House',
        '17700 56 Ave, Surrey, BC',
        50,
        49.096700, -122.730000,
        'https://wavescoffee.com',
        NULL,
        NULL
    );
