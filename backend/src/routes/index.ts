// src/routes/index.ts
//
// Central router. Mount all feature routers here and export a single router
// that index.ts attaches to the Express app.

import { Router, Request, Response } from 'express';
import pool from '../db';
import authRouter from './auth';

const router = Router();

router.use('/auth', authRouter);

// ── GET /api/health ───────────────────────────────────────────────────────────
// A lightweight endpoint to verify:
//   1. The Express server is reachable
//   2. The database connection pool is working
router.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (err) {
    // If the DB is down, return 503 Service Unavailable.
    res.status(503).json({
      status: 'error',
      database: 'unreachable',
    });
  }
});

export default router;
