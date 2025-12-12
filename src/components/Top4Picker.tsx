'use client';

import { useState } from 'react';
import { Album } from '@/types';
import { searchAlbums, getAlbumInfo, SearchResult } from '@/lib/lastfm';

interface Top4PickerProps {
  top4: Album[];
  onUpdate: (albums: Album[]) => void;
}

export function Top4Picker({ top4, onUpdate }: Top4PickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const openPicker = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    setIsModalOpen(true);
    setQuery('');
    setResults([]);
  };

  const closePicker = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setQuery('');
    setResults([]);
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const albums = await searchAlbums(value);
    setResults(albums);
    setIsSearching(false);
  };

  const handleSelectAlbum = async (result: SearchResult) => {
    if (selectedSlot === null) return;

    // Get full album info
    const albumInfo = await getAlbumInfo(result.artist, result.name);
    const album: Album = albumInfo || {
      name: result.name,
      artist: result.artist,
      year: 'Unknown',
      imageUrl: result.imageUrl,
    };

    // Update top 4 array
    const newTop4 = [...top4];
    // Ensure array has 4 slots
    while (newTop4.length < 4) {
      newTop4.push(null as unknown as Album);
    }
    newTop4[selectedSlot] = album;

    onUpdate(newTop4.filter(Boolean));
    closePicker();
  };

  const handleRemoveAlbum = (index: number) => {
    const newTop4 = top4.filter((_, i) => i !== index);
    onUpdate(newTop4);
  };

  // Render 4 slots, filled or empty
  const slots = [0, 1, 2, 3];

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {slots.map((index) => {
          const album = top4[index];
          
          if (album) {
            // Filled slot
            return (
              <div key={index} className="relative group">
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
                {/* Remove button on hover */}
                <button
                  onClick={() => handleRemoveAlbum(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white
                             opacity-0 group-hover:opacity-100 transition-opacity
                             flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
                <p className="mt-1 text-xs text-bf-text truncate">{album.artist}</p>
              </div>
            );
          }

          // Empty slot
          return (
            <button
              key={index}
              onClick={() => openPicker(index)}
              className="aspect-square rounded-lg border-2 border-dashed border-bf-border
                         hover:border-bf-accent hover:bg-bf-card-hover transition-colors
                         flex items-center justify-center"
            >
              <span className="text-2xl text-bf-text/40">+</span>
            </button>
          );
        })}
      </div>

      {/* Picker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-bf-card rounded-xl w-full max-w-md max-h-[80vh] flex flex-col border border-bf-border shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-bf-border">
              <h3 className="text-lg font-bold text-bf-text-light">Pick an Album</h3>
              <button
                onClick={closePicker}
                className="text-bf-text hover:text-bf-text-light"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for an album..."
                autoFocus
                className="w-full px-4 py-3 bg-bf-bg border border-bf-border rounded-lg 
                           text-bf-text-light placeholder-bf-text/50
                           focus:outline-none focus:border-bf-accent focus:ring-1 focus:ring-bf-accent"
              />
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {isSearching && (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-bf-accent/30 border-t-bf-accent rounded-full animate-spin" />
                </div>
              )}

              {!isSearching && results.length > 0 && (
                <div className="space-y-2">
                  {results.map((album, i) => (
                    <button
                      key={`${album.artist}-${album.name}-${i}`}
                      onClick={() => handleSelectAlbum(album)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg
                                 hover:bg-bf-card-hover transition-colors text-left"
                    >
                      {album.imageUrl ? (
                        <img
                          src={album.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-bf-border flex items-center justify-center">
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

              {!isSearching && query && results.length === 0 && (
                <p className="text-center text-bf-text/60 py-8">No albums found</p>
              )}

              {!query && (
                <p className="text-center text-bf-text/60 py-8">
                  Search for any album to add to your Top 4
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

