// src/components/Navbar.tsx

import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b bg-white flex items-center px-4 gap-4 shrink-0">
      <Link to="/" className="font-semibold text-base tracking-tight">
        ☕ Vancouver Coffee Explorer
      </Link>

      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.username}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
