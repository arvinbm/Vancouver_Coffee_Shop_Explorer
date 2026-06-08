// src/index.ts
//
// Express application entry point.
// Responsibilities:
//   - Load environment variables
//   - Create and configure the Express app (middleware stack)
//   - Mount the API router
//   - Start the HTTP server

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';

// Load .env before anything else so all process.env.* reads see the values.
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;

// ── Middleware ────────────────────────────────────────────────────────────────

// cors: allows the React frontend (running on port 5173) to call this API.
// In production you'd restrict the origin to your actual domain.
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://orange-mushroom-014982d10.7.azurestaticapps.net',
  ],
}));

// express.json(): parses incoming request bodies with Content-Type: application/json.
// Without this, req.body is undefined on POST/PATCH requests.
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

// All API routes live under /api. This prefix makes it easy to:
//   - Add a catch-all 404 for unmatched routes later
//   - Proxy /api/* to the backend in Nginx or Vite's dev server config
app.use('/api', router);

// ── 404 fallback ─────────────────────────────────────────────────────────────
// Any request that didn't match a route above falls through to here.
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] running on http://localhost:${PORT}`);
  console.log(`[server] environment: ${process.env.NODE_ENV ?? 'development'}`);
});
