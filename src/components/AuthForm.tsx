'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export function AuthForm() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setMessage('');

    const { error } = await signInWithEmail(email);

    if (error) {
      setMessage('Something went wrong. Please try again.');
    } else {
      setMessage('Check your email for a magic link! ✨');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-bf-card rounded-xl p-8 max-w-md w-full border border-bf-border shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-5xl mb-4 block">🍴</span>
          <h1 className="text-2xl font-bold text-bf-text-light mb-2">Welcome to Bitchfork</h1>
          <p className="text-bf-text">Sign in to start logging albums</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-bf-text text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-bf-bg border border-bf-border rounded-lg 
                         text-bf-text-light placeholder-bf-text/50
                         focus:outline-none focus:border-bf-accent focus:ring-1 focus:ring-bf-accent"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-bf-accent hover:bg-bf-accent-hover disabled:opacity-50 
                       disabled:cursor-not-allowed text-bf-bg font-semibold py-3 rounded-lg 
                       transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('Check') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-bf-text/60 text-xs">
          No password needed — we'll email you a sign-in link
        </p>
      </div>
    </div>
  );
}

