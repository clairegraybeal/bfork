'use client';

import { useAuth } from '@/lib/auth-context';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-bf-bg/95 backdrop-blur border-b border-bf-border">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🍴</span>
          <h1 className="text-xl font-bold text-bf-text-light group-hover:text-bf-accent transition-colors">
            Bitchfork
          </h1>
        </a>
        
        <div className="flex items-center gap-3">
          {user && (
            <>
              <a 
                href="/log"
                className="bg-bf-accent hover:bg-bf-accent-hover text-bf-bg font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                + Log
              </a>
              <a
                href="/profile"
                className="w-9 h-9 rounded-full bg-bf-card border border-bf-border flex items-center justify-center
                           hover:border-bf-accent hover:bg-bf-card-hover transition-colors"
                title="Profile"
              >
                <span className="text-lg">👤</span>
              </a>
              <button
                onClick={() => signOut()}
                className="text-bf-text hover:text-bf-text-light text-sm transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
