'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getProfile, createProfile, updateUsername, updateTop4, Profile } from '@/lib/profiles';
import { getReviews } from '@/lib/reviews';
import { Album } from '@/types';
import { Header } from '@/components/Header';
import { Top4Picker } from '@/components/Top4Picker';
import { EditUsernameModal } from '@/components/EditUsernameModal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [stats, setStats] = useState({ count: 0, avgRating: 0 });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setIsLoadingProfile(true);

    let profileData = await getProfile(user.id);

    // If no profile exists, create one with default username from email
    if (!profileData) {
      const defaultUsername = user.email?.split('@')[0] || 'User';
      await createProfile(user.id, defaultUsername);
      profileData = await getProfile(user.id);
    }

    setProfile(profileData);
    setIsLoadingProfile(false);
  };

  const loadStats = async () => {
    if (!user) return;
    const reviews = await getReviews(user.id);
    const count = reviews.length;
    const avgRating = count > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;
    setStats({ count, avgRating });
  };

  const handleSaveUsername = async (newUsername: string) => {
    if (!user) return;
    setIsSaving(true);
    const result = await updateUsername(user.id, newUsername);
    if (result.success) {
      setProfile(prev => prev ? { ...prev, username: newUsername } : null);
    }
    setIsSaving(false);
  };

  const handleUpdateTop4 = async (albums: Album[]) => {
    if (!user) return;
    setIsSaving(true);
    const result = await updateTop4(user.id, albums);
    if (result.success) {
      setProfile(prev => prev ? { ...prev, top_4: albums } : null);
    }
    setIsSaving(false);
  };

  if (loading || isLoadingProfile) {
    return (
      <>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <>
      <Header />
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
              {profile.username}
            </h1>

            {/* Email */}
            <p className="text-bf-text text-sm mb-3">
              {user.email}
            </p>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditingUsername(true)}
              className="text-sm text-bf-accent hover:text-bf-accent-hover transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Top 4 Section */}
          <div className="mb-8">
            <h2 className="text-center text-bf-text/60 text-sm font-semibold tracking-wider mb-4">
              ✦ TOP 4 ALBUMS ✦
            </h2>
            <Top4Picker
              top4={profile.top_4 || []}
              onUpdate={handleUpdateTop4}
            />
          </div>

          {/* Stats */}
          <div className="text-center py-4 border-t border-bf-border">
            <p className="text-bf-text">
              <span className="text-bf-text-light font-semibold">{stats.count}</span> albums logged
              {stats.count > 0 && (
                <>
                  <span className="mx-2">•</span>
                  Avg: <span className="text-bf-star">{stats.avgRating.toFixed(1)} ★</span>
                </>
              )}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-bf-border py-6 mt-auto">
        <div className="max-w-2xl mx-auto px-4 text-center text-bf-text/60 text-sm">
          <p>Made with 🎵 for album lovers</p>
        </div>
      </footer>

      {/* Edit Username Modal */}
      {isEditingUsername && (
        <EditUsernameModal
          currentUsername={profile.username}
          onSave={handleSaveUsername}
          onClose={() => setIsEditingUsername(false)}
        />
      )}
    </>
  );
}

