// src/pages/AuthCallbackPage.tsx
//
// Landing page for the Google OAuth redirect.
// The backend sends the user here after a successful login:
//   /auth/callback?token=<jwt>&username=<name>&id=<userId>
// We read those params, store them in AuthContext, and redirect to the map.

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const token    = params.get('token');
    const username = params.get('username');
    const id       = params.get('id');

    if (token && username && id) {
      login(token, { id: Number(id), username });
      navigate('/', { replace: true });
    } else {
      // Something went wrong — send the user back to login
      navigate('/login?error=google_auth_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <p className="text-primary-foreground text-sm animate-pulse">Signing you in…</p>
    </div>
  );
}
