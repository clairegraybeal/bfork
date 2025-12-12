import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbReview = {
  id: string;
  user_id: string;
  album_name: string;
  album_artist: string;
  album_year: string;
  album_image_url: string;
  rating: number;
  review_text: string;
  created_at: string;
};

