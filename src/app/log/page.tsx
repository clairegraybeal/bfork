'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Album } from '@/types';
import { getAlbumInfo, SearchResult } from '@/lib/lastfm';
import { saveReview, getUsername, generateId } from '@/lib/storage';
import { AlbumSearch } from '@/components/AlbumSearch';
import { StarRating } from '@/components/StarRating';

export default function LogAlbum() {
  const router = useRouter();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isLoadingAlbum, setIsLoadingAlbum] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const MAX_CHARS = 700;
  const charsRemaining = MAX_CHARS - reviewText.length;

  const handleAlbumSelect = async (result: SearchResult) => {
    setIsLoadingAlbum(true);
    const albumInfo = await getAlbumInfo(result.artist, result.name);
    
    if (albumInfo) {
      setSelectedAlbum(albumInfo);
    } else {
      // Fallback if detailed info isn't available
      setSelectedAlbum({
        name: result.name,
        artist: result.artist,
        year: 'Unknown',
        imageUrl: result.imageUrl,
      });
    }
    setIsLoadingAlbum(false);
  };

  const handleSave = () => {
    if (!selectedAlbum || rating === 0) return;

    setIsSaving(true);
    
    const review = {
      id: generateId(),
      album: selectedAlbum,
      rating,
      text: reviewText.trim(),
      reviewedBy: getUsername() || 'Anonymous',
      reviewedAt: new Date().toISOString(),
    };

    saveReview(review);
    router.push('/');
  };

  const handleClear = () => {
    setSelectedAlbum(null);
    setRating(0);
    setReviewText('');
  };

  return (
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
  );
}

