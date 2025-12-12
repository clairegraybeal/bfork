import { supabase } from './supabase';
import { Album } from '@/types';

export type Profile = {
  user_id: string;
  username: string;
  top_4: Album[];
  created_at: string;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // Profile doesn't exist yet
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching profile:', error);
    return null;
  }

  return {
    user_id: data.user_id,
    username: data.username,
    top_4: data.top_4 || [],
    created_at: data.created_at,
  };
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching profile by username:', error);
    return null;
  }

  return {
    user_id: data.user_id,
    username: data.username,
    top_4: data.top_4 || [],
    created_at: data.created_at,
  };
}

export async function createProfile(
  userId: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('profiles').insert({
    user_id: userId,
    username,
    top_4: [],
  });

  if (error) {
    console.error('Error creating profile:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateUsername(
  userId: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating username:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateTop4(
  userId: string,
  top4: Album[]
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('profiles')
    .update({ top_4: top4 })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating top 4:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
