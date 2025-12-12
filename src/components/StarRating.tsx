'use client';

import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ 
  value, 
  onChange, 
  readonly = false,
  size = 'md' 
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'text-lg gap-0.5',
    md: 'text-2xl gap-1',
    lg: 'text-4xl gap-1.5',
  };

  const displayValue = hover ?? value;

  return (
    <div className={`flex ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star === value ? 0 : star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => setHover(null)}
          className={`
            transition-all duration-150
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            ${star <= displayValue ? 'text-bf-star' : 'text-bf-border'}
          `}
        >
          ★
        </button>
      ))}
    </div>
  );
}

