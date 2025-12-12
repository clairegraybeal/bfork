'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Review } from '@/types';
import { getProfileByUsername, Profile } from '@/lib/profiles';
import { getPublicReviews } from '@/lib/reviews';
import { StarRating } from '@/components/StarRating';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (username) {
      loadPublicProfile();
    }
  }, [username]);

  const loadPublicProfile = async () => {
    setIsLoading(true);
    
    const profileData = await getProfileByUsername(username);
    
    if (!profileData) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setProfile(profileData);

    // Load their reviews
    const reviewsData = await getPublicReviews(profileData.user_id);
    const reviewsWithUsername = reviewsData.map(r => ({
      ...r,
      reviewedBy: profileData.username,
    }));
    setReviews(reviewsWithUsername);
    
    setIsLoading(false);
  };

  // Calculate stats
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bf-bg flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-bf-bg flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-bf-bg/95 backdrop-blur border-b border-bf-border">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <a href="/" className="flex items-center gap-2 group w-fit">
              <span className="text-2xl">🍴</span>
              <h1 className="text-xl font-bold text-bf-text-light group-hover:text-bf-accent transition-colors">
                Bitchfork
              </h1>
            </a>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-bf-text-light mb-2">User not found</h2>
            <p className="text-bf-text mb-6">No one with the username "{username}" exists.</p>
            <a 
              href="/"
              className="inline-block bg-bf-accent hover:bg-bf-accent-hover text-bf-bg font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Go Home
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bf-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bf-bg/95 backdrop-blur border-b border-bf-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🍴</span>
            <h1 className="text-xl font-bold text-bf-text-light group-hover:text-bf-accent transition-colors">
              Bitchfork
            </h1>
          </a>
          <a 
            href="/"
            className="text-bf-text hover:text-bf-text-light text-sm transition-colors"
          >
            Sign in
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-bf-card border-2 border-bf-border
                            flex items-center justify-center text-4xl">
              👤
            </div>

            {/* Username */}
            <h1 className="text-2xl font-bold text-bf-text-light mb-1">
              {profile?.username}
            </h1>

            {/* Stats */}
            <p className="text-bf-text text-sm">
              {reviews.length} album{reviews.length !== 1 ? 's' : ''} logged
              {reviews.length > 0 && (
                <span> • Avg: <span className="text-bf-star">{avgRating.toFixed(1)} ★</span></span>
              )}
            </p>
          </div>

          {/* Top 4 Section */}
          {profile?.top_4 && profile.top_4.length > 0 && (
            <div className="mb-8">
              <h2 className="text-center text-bf-text/60 text-sm font-semibold tracking-wider mb-4">
                ✦ TOP 4 ALBUMS ✦
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {profile.top_4.map((album, index) => (
                  <div key={index}>
                    <div className="aspect-square rounded-lg overflow-hidden bg-bf-card border border-bf-border">
                      {album.imageUrl ? (
                        <img
                          src={album.imageUrl}
                          alt={album.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          💿
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-bf-text truncate">{album.artist}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div>
            <h2 className="text-bf-text/60 text-sm font-semibold tracking-wider mb-4">
              RECENT REVIEWS
            </h2>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <article key={review.id} className="bg-bf-card rounded-lg overflow-hidden">
                    <div className="flex gap-4 p-4">
                      {/* Album Thumbnail */}
                      <div className="flex-shrink-0">
                        {review.album.imageUrl ? (
                          <img 
                            src={review.album.imageUrl} 
                            alt={`${review.album.name} by ${review.album.artist}`}
                            className="w-20 h-20 md:w-24 md:h-24 rounded object-cover shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded bg-bf-border flex items-center justify-center">
                            <span className="text-3xl">💿</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Album Info */}
                        <h3 className="font-bold text-bf-text-light text-lg truncate">
                          {review.album.name}
                        </h3>
                        <p className="text-bf-text text-sm">
                          {review.album.artist}
                          {review.album.year !== 'Unknown' && (
                            <span className="text-bf-text/60"> • {review.album.year}</span>
                          )}
                        </p>
                        
                        {/* Rating */}
                        <div className="my-2">
                          <StarRating value={review.rating} readonly size="sm" />
                        </div>
                        
                        {/* Review Text */}
                        {review.text && (
                          <p className="text-sm text-bf-text leading-relaxed line-clamp-3">
                            {review.text}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Meta Footer */}
                    <div className="px-4 py-2 bg-bf-bg/50 border-t border-bf-border/50">
                      <p className="text-xs text-bf-text/60">
                        {new Date(review.reviewedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-bf-card rounded-lg">
                <div className="text-4xl mb-2">📀</div>
                <p className="text-bf-text">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-bf-border py-6 mt-auto">
        <div className="max-w-2xl mx-auto px-4 text-center text-bf-text/60 text-sm">
          <p>Made with 🎵 for album lovers</p>
        </div>
      </footer>
    </div>
  );
}

