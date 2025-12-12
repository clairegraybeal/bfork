'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { getReviews, deleteReview, getUsername, setUsername } from '@/lib/storage';
import { ReviewCard } from '@/components/ReviewCard';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsernameState] = useState('');
  const [isSettingName, setIsSettingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    setReviews(getReviews());
    const storedName = getUsername();
    setUsernameState(storedName);
    if (!storedName) {
      setIsSettingName(true);
    }
  }, []);

  const handleSetUsername = () => {
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
      setUsernameState(nameInput.trim());
      setIsSettingName(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this review?')) {
      deleteReview(id);
      setReviews(getReviews());
    }
  };

  // Username setup modal
  if (isSettingName) {
    return (
      <div className="fixed inset-0 bg-bf-bg/95 flex items-center justify-center p-4 z-50">
        <div className="bg-bf-card rounded-xl p-6 max-w-sm w-full border border-bf-border shadow-2xl">
          <h2 className="text-xl font-bold text-bf-text-light mb-2">Welcome to Bitchfork!</h2>
          <p className="text-bf-text mb-4">What should we call you?</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetUsername()}
            placeholder="Your name"
            autoFocus
            className="w-full px-4 py-3 bg-bf-bg border border-bf-border rounded-lg 
                       text-bf-text-light placeholder-bf-text/50
                       focus:outline-none focus:border-bf-accent focus:ring-1 focus:ring-bf-accent
                       mb-4"
          />
          <button
            onClick={handleSetUsername}
            disabled={!nameInput.trim()}
            className="w-full bg-bf-accent hover:bg-bf-accent-hover disabled:opacity-50 disabled:cursor-not-allowed
                       text-bf-bg font-semibold py-3 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-bf-text-light mb-1">
          Hey, {username} 👋
        </h2>
        <p className="text-bf-text">
          {reviews.length === 0 
            ? "You haven't logged any albums yet. Start your collection!"
            : `You've logged ${reviews.length} album${reviews.length === 1 ? '' : 's'}.`
          }
        </p>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📀</div>
          <h3 className="text-lg font-semibold text-bf-text-light mb-2">No albums logged yet</h3>
          <p className="text-bf-text mb-6">Start by logging your first album review!</p>
          <a 
            href="/log"
            className="inline-block bg-bf-accent hover:bg-bf-accent-hover text-bf-bg font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            + Log Your First Album
          </a>
        </div>
      )}
    </div>
  );
}

