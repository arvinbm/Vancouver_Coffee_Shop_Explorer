// src/App.tsx
//
// Root component — the top of the React component tree.
// Right now it just renders a placeholder and checks that the backend is alive.
//
// What gets built here next, in order:
//   1. A CoffeeShopList component that fetches GET /api/shops
//   2. A NeighborhoodFilter component (dropdown → filters the list)
//   3. A MapView component (Leaflet map with shop markers)
//   4. A ShopCard component (detail panel when you click a marker)

import { useEffect, useState } from 'react';

// The shape of the health-check response from GET /api/health.
// Defining it as a TypeScript type means the compiler will catch typos
// like `data.statuss` at build time rather than at runtime.
type HealthResponse = {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'unreachable';
};

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // useEffect with an empty dependency array [] runs once after the first render —
    // the equivalent of componentDidMount in class components.
    // This is the standard place to kick off data fetching.
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 640, margin: '60px auto', padding: '0 20px' }}>
      <h1>☕ Vancouver Coffee Explorer</h1>
      <p style={{ color: '#555' }}>
        Discover and filter Vancouver coffee shops on an interactive map.
      </p>

      <hr />

      <h2>Backend status</h2>
      {error && <p style={{ color: 'red' }}>Could not reach backend: {error}</p>}
      {!health && !error && <p>Checking...</p>}
      {health && (
        <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 6 }}>
          {JSON.stringify(health, null, 2)}
        </pre>
      )}

      <hr />

      <h2>What's coming</h2>
      <ul>
        <li>☐ Fetch and display coffee shops from the API</li>
        <li>☐ Filter by neighborhood</li>
        <li>☐ Interactive Leaflet map with markers</li>
        <li>☐ Shop detail panel on marker click</li>
      </ul>
    </div>
  );
}
