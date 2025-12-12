import { supabase, DbReview } from './supabase';
import { Review, Album } from '@/types';

// Convert database row to app Review type
function dbToReview(row: DbReview): Review {
  return {
    id: row.id,
    album: {
      name: row.album_name,
      artist: row.album_artist,
      year: row.album_year,
      imageUrl: row.album_image_url,
    },
    rating: row.rating,
    text: row.review_text,
    reviewedBy: '', // Will be filled from user profile
    reviewedAt: row.created_at,
  };
}

export async function getReviews(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return (data || []).map(dbToReview);
}

// Public version - for viewing other users' reviews
export async function getPublicReviews(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public reviews:', error);
    return [];
  }

  return (data || []).map(dbToReview);
}

export async function saveReview(
  userId: string,
  album: Album,
  rating: number,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('reviews').insert({
    user_id: userId,
    album_name: album.name,
    album_artist: album.artist,
    album_year: album.year,
    album_image_url: album.imageUrl,
    rating,
    review_text: text,
  });

  if (error) {
    console.error('Error saving review:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteReview(id: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting review:', error);
    return false;
  }

  return true;
}
