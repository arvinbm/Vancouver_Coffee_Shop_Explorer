import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/shops
// Optional query param: ?neighborhood_id=1
router.get('/', async (req: Request, res: Response) => {
  const { neighborhood_id } = req.query;

  try {
    let query = `
      SELECT cs.*, n.name AS neighborhood_name
      FROM coffee_shops cs
      LEFT JOIN neighborhoods n ON cs.neighborhood_id = n.id
    `;
    const params: unknown[] = [];

    if (neighborhood_id) {
      query += ' WHERE cs.neighborhood_id = $1';
      params.push(neighborhood_id);
    }

    query += ' ORDER BY cs.name ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('[shops] GET / error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/shops/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT cs.*, n.name AS neighborhood_name
       FROM coffee_shops cs
       LEFT JOIN neighborhoods n ON cs.neighborhood_id = n.id
       WHERE cs.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Coffee shop not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[shops] GET /:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/shops — protected
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const {
    name, address, neighborhood_id,
    latitude, longitude,
    website, phone, google_maps_url, google_place_id,
  } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Shop name is required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO coffee_shops
        (name, address, neighborhood_id, latitude, longitude, website, phone, google_maps_url, google_place_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, address, neighborhood_id, latitude, longitude, website, phone, google_maps_url, google_place_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505') {
      res.status(409).json({ error: 'A coffee shop with this Google Place ID already exists' });
      return;
    }
    console.error('[shops] POST / error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
