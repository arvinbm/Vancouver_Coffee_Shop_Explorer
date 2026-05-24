// src/db/index.ts
//
// Creates a single shared connection pool for the whole app.
//
// Why a pool? Opening a new TCP connection to Postgres on every request is
// expensive (~50ms). A Pool keeps several connections open and reuses them.
// pg's default pool size is 10 — fine for development, tune for production.
//
// Usage in route handlers:
//   import pool from '../db';
//   const result = await pool.query('SELECT * FROM coffee_shops WHERE id = $1', [id]);

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // How long (ms) a client stays idle before being closed.
  // Prevents stale connections from hanging around.
  idleTimeoutMillis: 30_000,
  // How long (ms) to wait for a connection before throwing.
  connectionTimeoutMillis: 5_000,
});

// Fires whenever a new client is created in the pool — useful for debugging.
pool.on('connect', () => {
  console.log('[db] new client connected to pool');
});

pool.on('error', (err) => {
  console.error('[db] unexpected pool error:', err.message);
});

export default pool;
