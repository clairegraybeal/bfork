'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Album } from '@/types';
import { getAlbumInfo, SearchResult } from '@/lib/lastfm';
import { saveReview } from '@/lib/reviews';
import { useAuth } from '@/lib/auth-context';
import { AlbumSearch } from '@/components/AlbumSearch';
import { StarRating } from '@/components/StarRating';
import { Header } from '@/components/Header';

export default function LogAlbum() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isLoadingAlbum, setIsLoadingAlbum] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const MAX_CHARS = 700;
  const charsRemaining = MAX_CHARS - reviewText.length;

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleAlbumSelect = async (result: SearchResult) => {
    setIsLoadingAlbum(true);
    const albumInfo = await getAlbumInfo(result.artist, result.name);
    
    if (albumInfo) {
      setSelectedAlbum(albumInfo);
    } else {
      setSelectedAlbum({
        name: result.name,
        artist: result.artist,
        year: 'Unknown',
        imageUrl: result.imageUrl,
      });
    }
    setIsLoadingAlbum(false);
  };

  const handleSave = async () => {
    if (!selectedAlbum || rating === 0 || !user) return;

    setIsSaving(true);
    setError('');

    const result = await saveReview(user.id, selectedAlbum, rating, reviewText.trim());

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Failed to save review');
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setSelectedAlbum(null);
    setRating(0);
    setReviewText('');
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-bf-text-light mb-6">Log an Album</h2>

          {/* Album Search */}
          {!selectedAlbum && !isLoadingAlbum && (
            <div className="mb-6">
              <label className="block text-bf-text mb-2 text-sm">Search for an album</label>
              <AlbumSearch onSelect={handleAlbumSelect} />
            </div>
          )}

          {/* Loading State */}
          {isLoadingAlbum && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
            </div>
          )}

          {/* Selected Album */}
          {selectedAlbum && (
            <div className="space-y-6">
              {/* Album Card */}
              <div className="bg-bf-card rounded-xl p-4 flex gap-4 border border-bf-border">
                {selectedAlbum.imageUrl ? (
                  <img 
                    src={selectedAlbum.imageUrl} 
                    alt={selectedAlbum.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-bf-border flex items-center justify-center text-4xl">
                    💿
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-bf-text-light">{selectedAlbum.name}</h3>
                  <p className="text-bf-text">{selectedAlbum.artist}</p>
                  {selectedAlbum.year !== 'Unknown' && (
                    <p className="text-bf-text/60 text-sm mt-1">{selectedAlbum.year}</p>
                  )}
                  <button
                    onClick={handleClear}
                    className="mt-3 text-sm text-bf-accent hover:text-bf-accent-hover"
                  >
                    Choose different album
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-bf-text mb-3 text-sm">Your Rating</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
                {rating === 0 && (
                  <p className="text-bf-text/60 text-sm mt-2">Tap a star to rate</p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-bf-text text-sm">Review (optional)</label>
                  <span className={`text-xs ${charsRemaining < 50 ? 'text-bf-accent' : 'text-bf-text/60'}`}>
                    {charsRemaining} characters remaining
                  </span>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="What did you think of this album?"
                  rows={4}
                  className="w-full px-4 py-3 bg-bf-card border border-bf-border rounded-lg 
                             text-bf-text-light placeholder-bf-text/50 resize-none
                             focus:outline-none focus:border-bf-accent focus:ring-1 focus:ring-bf-accent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex-1 py-3 rounded-lg border border-bf-border text-bf-text 
                             hover:bg-bf-card-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={rating === 0 || isSaving}
                  className="flex-1 bg-bf-accent hover:bg-bf-accent-hover disabled:opacity-50 
                             disabled:cursor-not-allowed text-bf-bg font-semibold py-3 rounded-lg 
                             transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
