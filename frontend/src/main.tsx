// src/main.tsx
//
// The JavaScript entry point for the React app. Vite starts here.
// It finds the <div id="root"> in index.html and mounts the React tree into it.
// StrictMode renders every component twice in development to help catch bugs
// (double-invocations, missing cleanup in useEffect, etc.). Has no effect in prod.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found — check index.html');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
