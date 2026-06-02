import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/neighborhoods
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM neighborhoods ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('[neighborhoods] GET / error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
