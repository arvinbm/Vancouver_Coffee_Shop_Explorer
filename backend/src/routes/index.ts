// src/routes/index.ts
//
// Central router. Mount all feature routers here and export a single router
// that index.ts attaches to the Express app.
//
// Pattern:
//   app.use('/api', router)      ← in index.ts
//   router.use('/shops', shopsRouter)   ← added here when you build it
//
// This keeps index.ts clean — it never needs to know about individual routes.

import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// ── GET /api/health ───────────────────────────────────────────────────────────
// A lightweight endpoint to verify:
//   1. The Express server is reachable
//   2. The database connection pool is working
//
// Load balancers and container orchestrators (ECS, Azure Container Apps) ping
// this route to decide if the container is healthy before sending real traffic.
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // A trivial query — just confirms we can talk to Postgres.
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (err) {
    // If the DB is down, return 503 Service Unavailable (not 500 — it's not a
    // code bug, it's an infrastructure problem).
    res.status(503).json({
      status: 'error',
      database: 'unreachable',
    });
  }
});

// ── Placeholder: coffee shops router ─────────────────────────────────────────
// This is where you'll wire in the shops router once you build it:
//
//   import shopsRouter from './shops';
//   router.use('/shops', shopsRouter);
//
// That will expose:
//   GET  /api/shops           → list all shops (with optional ?neighborhood= filter)
//   GET  /api/shops/:id       → single shop detail
//   POST /api/shops           → add a shop (admin only later)

export default router;
