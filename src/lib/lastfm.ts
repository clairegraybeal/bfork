import { Album } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export interface SearchResult {
  name: string;
  artist: string;
  imageUrl: string;
  mbid?: string;
}

export async function searchAlbums(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const res = await fetch(
      `${BASE_URL}?method=album.search&album=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=8`
    );
    const data = await res.json();
    
    if (!data.results?.albummatches?.album) return [];
    
    return data.results.albummatches.album
      .filter((a: any) => a.name && a.artist)
      .map((a: any) => ({
        name: a.name,
        artist: a.artist,
        imageUrl: a.image?.[3]?.['#text'] || a.image?.[2]?.['#text'] || '',
        mbid: a.mbid || undefined,
      }));
  } catch (error) {
    console.error('Failed to search albums:', error);
    return [];
  }
}

export async function getAlbumInfo(artist: string, album: string): Promise<Album | null> {
  try {
    const res = await fetch(
      `${BASE_URL}?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
    );
    const data = await res.json();
    
    if (!data.album) return null;
    
    // Try to extract year from wiki or tags
    let year = 'Unknown';
    if (data.album.wiki?.published) {
      const match = data.album.wiki.published.match(/\d{4}/);
      if (match) year = match[0];
    }
    
    return {
      name: data.album.name,
      artist: data.album.artist,
      year,
      imageUrl: data.album.image?.[3]?.['#text'] || data.album.image?.[2]?.['#text'] || '',
      mbid: data.album.mbid || undefined,
    };
  } catch (error) {
    console.error('Failed to get album info:', error);
    return null;
  }
}

