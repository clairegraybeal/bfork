'use client';

import { useState, useEffect, useRef } from 'react';
import { searchAlbums, SearchResult } from '@/lib/lastfm';

interface AlbumSearchProps {
  onSelect: (album: SearchResult) => void;
}

export function AlbumSearch({ onSelect }: AlbumSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const albums = await searchAlbums(query);
      setResults(albums);
      setIsOpen(albums.length > 0);
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (album: SearchResult) => {
    onSelect(album);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for an album..."
          className="w-full px-4 py-3 bg-bf-card border border-bf-border rounded-lg 
                     text-bf-text-light placeholder-bf-text/50
                     focus:outline-none focus:border-bf-accent focus:ring-1 focus:ring-bf-accent
                     transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-bf-card border border-bf-border rounded-lg shadow-xl overflow-hidden">
          {results.map((album, index) => (
            <button
              key={`${album.artist}-${album.name}-${index}`}
              onClick={() => handleSelect(album)}
              className="w-full flex items-center gap-3 p-3 hover:bg-bf-card-hover transition-colors text-left"
            >
              {album.imageUrl ? (
                <img 
                  src={album.imageUrl} 
                  alt=""
                  className="w-12 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-bf-border flex items-center justify-center text-xl">
                  💿
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-bf-text-light font-medium truncate">{album.name}</p>
                <p className="text-bf-text text-sm truncate">{album.artist}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

