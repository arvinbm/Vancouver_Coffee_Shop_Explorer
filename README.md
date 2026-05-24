# Vancouver Coffee Explorer

A full-stack web application to discover and filter Vancouver coffee shops on an interactive map. Built to learn and demonstrate a production-grade stack: React + TypeScript on the front end, Node.js/Express on the back end, PostgreSQL as the database, all wired together with Docker Compose.

---

## Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Component model, type safety, fast dev server with HMR |
| Backend | Node.js + Express + TypeScript | Lightweight REST API, same language across the stack |
| Database | PostgreSQL 16 | Relational, great geospatial support, industry standard |
| Dev environment | Docker Compose | One command spins up all three services consistently |

---

## Project Structure

```
Vancouver_Coffee_Shop_Explorer/
├── docker-compose.yml        # Defines postgres, backend, and frontend services
├── db/
│   └── 001_init.sql          # Schema (runs automatically on first `docker compose up`)
├── backend/
│   ├── Dockerfile
│   ├── .env.example          # Copy to .env and fill in values
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── index.ts          # Express app entry point
│       ├── db/
│       │   └── index.ts      # Shared pg connection pool
│       └── routes/
│           └── index.ts      # API router — /api/health + future routes
└── frontend/
    ├── Dockerfile
    ├── vite.config.ts        # Dev server + /api proxy to backend
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx          # React entry point
        └── App.tsx           # Root component (health check + feature checklist)
```

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- That's it — Node and Postgres run inside containers.

### Run

```bash
git clone https://github.com/arvinbm/Vancouver_Coffee_Shop_Explorer.git
cd Vancouver_Coffee_Shop_Explorer
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:5173 |
| Backend (API) | http://localhost:4000 |
| Health check | http://localhost:4000/api/health |
| Postgres | localhost:**5433** (not 5432 — avoids clashing with a local install) |

### Connect to the database directly

```bash
docker compose exec postgres psql -U postgres -d coffee_explorer
```

### Tear down (keep data)
```bash
docker compose down
```

### Tear down and reset the database
```bash
docker compose down -v   # -v removes the named postgres_data volume
```

---

## How the pieces connect

```
Browser (port 5173)
  │
  │  /api/* requests
  ▼
Vite dev server (proxy)
  │
  │  forwards to backend:4000
  ▼
Express API (port 4000)
  │
  │  SQL queries via pg Pool
  ▼
PostgreSQL (port 5432 inside Docker, 5433 on host)
```

The Vite proxy (`vite.config.ts`) is the key dev-time trick: the browser only ever talks to `localhost:5173`, so there are no CORS issues in development. In production, Nginx or a load balancer would handle the same proxying.

---

## What's built so far

- [x] Docker Compose stack (Postgres + backend + frontend)
- [x] PostgreSQL schema — `coffee_shops` and `neighborhoods` tables with indexes
- [x] Express server with middleware (CORS, JSON body parser)
- [x] Shared pg connection pool with error handling
- [x] `GET /api/health` — verifies both the server and DB are reachable
- [x] React + Vite shell with a health-check display

## What's next (build in this order)

- [ ] `GET /api/neighborhoods` — list all neighborhoods
- [ ] `GET /api/shops` — list shops, with optional `?neighborhood_id=` filter
- [ ] `GET /api/shops/:id` — single shop detail
- [ ] Seed the DB with real Vancouver coffee shop data
- [ ] `<CoffeeShopList>` React component — fetches and renders the shop list
- [ ] `<NeighborhoodFilter>` — dropdown that drives the list filter
- [ ] `<MapView>` — Leaflet map with a marker per shop
- [ ] `<ShopCard>` — detail panel on marker click

---

## Environment variables

Copy `backend/.env.example` to `backend/.env`. When running via Docker Compose the variables are injected through `docker-compose.yml` automatically, so `.env` is only needed for running the backend outside Docker.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Port the Express server listens on |
| `DATABASE_URL` | see `.env.example` | Full Postgres connection string |
| `NODE_ENV` | `development` | Controls CORS origin and logging verbosity |
