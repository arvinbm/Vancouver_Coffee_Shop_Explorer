// vite.config.ts
//
// Vite is the build tool and dev server for the React frontend.
//
// The proxy block is the key piece: any request from React to /api/*
// gets forwarded to the backend at port 4000. This means in development
// you don't need CORS headers for API calls — the browser thinks everything
// comes from the same origin (localhost:5173).
//
// In production, Nginx or a load balancer would do this proxying instead.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',   // needed inside Docker so the container is reachable from the host
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:4000',   // 'backend' is the Docker Compose service name
        changeOrigin: true,
      },
    },
  },
});
