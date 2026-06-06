import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router({ mergeParams: true });

// GET /api/shops/:id/reviews — public
router.get('/', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check the shop exists
    const shop = await pool.query(
      'SELECT id FROM coffee_shops WHERE id = $1',
      [id]
    );

    if (shop.rows.length === 0) {
      res.status(404).json({ error: 'Coffee shop not found' });
      return;
    }

    const result = await pool.query(
      `SELECT r.id, r.rating, r.body AS comment, r.created_at,
              u.username
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.coffee_shop_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('[reviews] GET / error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/shops/:id/reviews — protected
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { id: coffee_shop_id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user!.userId;

  if (!rating) {
    res.status(400).json({ error: 'rating is required' });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Rating must be between 1 and 5' });
    return;
  }

  try {
    // Check the shop exists
    const shop = await pool.query(
      'SELECT id FROM coffee_shops WHERE id = $1',
      [coffee_shop_id]
    );

    if (shop.rows.length === 0) {
      res.status(404).json({ error: 'Coffee shop not found' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, coffee_shop_id, rating, body)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, coffee_shop_id, rating, comment ?? null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505') {
      res.status(409).json({ error: 'You have already reviewed this coffee shop' });
      return;
    }
    console.error('[reviews] POST / error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/shops/:id/reviews/:reviewId — protected, own reviews only
router.delete('/:reviewId', authenticate, async (req: AuthRequest, res: Response) => {
  const { id: shopId, reviewId } = req.params;
  const userId = req.user!.userId;

  try {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 AND coffee_shop_id = $2 AND user_id = $3 RETURNING id',
      [reviewId, shopId, userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Review not found or not yours' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('[reviews] DELETE /:reviewId error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
