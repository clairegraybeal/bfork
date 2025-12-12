export interface Album {
  name: string;
  artist: string;
  year: string;
  imageUrl: string;
  mbid?: string;
}

export interface Review {
  id: string;
  album: Album;
  rating: number; // 0-5
  text: string; // max 700 chars
  reviewedBy: string;
  reviewedAt: string; // ISO date
}

