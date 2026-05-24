# ── Frontend Dockerfile (development) ────────────────────────────────────────
#
# This is a dev-only Dockerfile — it runs the Vite dev server with hot reload.
# For production you'd add a second stage that runs `vite build` and serves
# the static output via Nginx.

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy everything except src/ — src/ is mounted as a volume in docker-compose
# so changes on your host appear instantly inside the container.
COPY . .

EXPOSE 5173

# --host makes Vite listen on 0.0.0.0 (all interfaces), not just localhost,
# which is required for the port to be reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host"]
