# ── Backend Dockerfile ────────────────────────────────────────────────────────
#
# Two-stage build:
#   Stage 1 (builder) — installs ALL deps and compiles TypeScript → dist/
#   Stage 2 (runner)  — copies only the compiled JS + prod deps, no dev tools
#
# This keeps the final image small. TypeScript, ts-node-dev, etc. never make
# it into production.

# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first. Docker caches each layer — if package.json hasn't
# changed, the npm install layer is reused even when src/ changes.
COPY package*.json ./
RUN npm ci                        # ci = clean install, exact versions from lockfile

COPY tsconfig.json ./
COPY src ./src
RUN npm run build                 # tsc compiles src/ → dist/

# ── Stage 2: run ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev             # production deps only

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
