'use client';

import { useState } from 'react';

interface EditUsernameModalProps {
  currentUsername: string;
  onSave: (username: string) => Promise<void>;
  onClose: () => void;
}

export function EditUsernameModal({ currentUsername, onSave, onClose }: EditUsernameModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    if (username.length > 30) {
      setError('Username must be 30 characters or less');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onSave(username.trim());
      onClose();
    } catch (err) {
      setError('Failed to save. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-bf-card rounded-xl w-full max-w-sm border border-bf-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-bf-border">
          <h3 className="text-lg font-bold text-bf-text-light">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-bf-text hover:text-bf-text-light"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-bf-text text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3 bg-bf-bg border border-bf-border rounded-lg 
                         text-bf-text-light placeholder-bf-text/50
                         focus:outline-none focus:border-bf-accent focus:ring-1 focus:ring-bf-accent"
            />
            <p className="mt-1 text-xs text-bf-text/60 text-right">
              {username.length}/30
            </p>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-bf-border text-bf-text 
                         hover:bg-bf-card-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !username.trim()}
              className="flex-1 bg-bf-accent hover:bg-bf-accent-hover disabled:opacity-50 
                         disabled:cursor-not-allowed text-bf-bg font-semibold py-3 rounded-lg 
                         transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

