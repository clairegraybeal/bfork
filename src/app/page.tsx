'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { getReviews, deleteReview } from '@/lib/reviews';
import { getProfile, createProfile, Profile } from '@/lib/profiles';
import { useAuth } from '@/lib/auth-context';
import { ReviewCard } from '@/components/ReviewCard';
import { Header } from '@/components/Header';
import { AuthForm } from '@/components/AuthForm';

export default function Home() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadReviews();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    let profileData = await getProfile(user.id);
    
    // If no profile exists, create one with default username from email
    if (!profileData) {
      const defaultUsername = user.email?.split('@')[0] || 'User';
      await createProfile(user.id, defaultUsername);
      profileData = await getProfile(user.id);
    }
    
    setProfile(profileData);
  };

  const loadReviews = async () => {
    if (!user) return;
    setIsLoadingReviews(true);
    const data = await getReviews(user.id);
    setReviews(data);
    setIsLoadingReviews(false);
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Delete this review?')) return;
    
    const success = await deleteReview(id, user.id);
    if (success) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  // Get display name from profile or fall back to email
  const displayName = profile?.username || user?.email?.split('@')[0] || 'You';

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return <AuthForm />;
  }

  // Signed in
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-bf-text-light mb-1">
              Hey, {displayName} 👋
            </h2>
            <p className="text-bf-text">
              {isLoadingReviews 
                ? 'Loading your reviews...'
                : reviews.length === 0 
                  ? "You haven't logged any albums yet. Start your collection!"
                  : `You've logged ${reviews.length} album${reviews.length === 1 ? '' : 's'}.`
              }
            </p>
          </div>

          {/* Reviews List */}
          {isLoadingReviews ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={{
                    ...review,
                    reviewedBy: displayName,
                  }} 
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
      </main>

      {/* Footer */}
      <footer className="border-t border-bf-border py-6 mt-auto">
        <div className="max-w-2xl mx-auto px-4 text-center text-bf-text/60 text-sm">
          <p>Made with 🎵 for album lovers</p>
        </div>
      </footer>
    </>
  );
}
