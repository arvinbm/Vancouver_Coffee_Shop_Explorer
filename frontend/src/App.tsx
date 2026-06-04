// src/App.tsx
//
// Root component. Sets up client-side routing and wraps the whole app in
// AuthProvider so any component can call useAuth().
//
// Route map:
//   /         → MapPage   (main page — map + sidebar)
//   /login    → LoginPage
//   /signup   → SignupPage

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import MapPage from '@/pages/MapPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Full-height column: navbar on top, page content below */}
        <div className="flex flex-col h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
