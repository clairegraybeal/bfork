import { Review } from '@/types';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: string) => void;
}

export function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const formattedDate = new Date(review.reviewedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="bg-bf-card rounded-lg overflow-hidden hover:bg-bf-card-hover transition-colors group">
      <div className="flex gap-4 p-4">
        {/* Album Thumbnail */}
        <div className="flex-shrink-0">
          {review.album.imageUrl ? (
            <img 
              src={review.album.imageUrl} 
              alt={`${review.album.name} by ${review.album.artist}`}
              className="w-20 h-20 md:w-24 md:h-24 rounded object-cover shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded bg-bf-border flex items-center justify-center">
              <span className="text-3xl">💿</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Album Info */}
          <h3 className="font-bold text-bf-text-light text-lg truncate">
            {review.album.name}
          </h3>
          <p className="text-bf-text text-sm">
            {review.album.artist}
            {review.album.year !== 'Unknown' && (
              <span className="text-bf-text/60"> • {review.album.year}</span>
            )}
          </p>
          
          {/* Rating */}
          <div className="my-2">
            <StarRating value={review.rating} readonly size="sm" />
          </div>
          
          {/* Review Text */}
          {review.text && (
            <p className="text-sm text-bf-text leading-relaxed line-clamp-3">
              {review.text}
            </p>
          )}
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-bf-text/40 hover:text-red-500 self-start p-1"
            title="Delete review"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Meta Footer */}
      <div className="px-4 py-2 bg-bf-bg/50 border-t border-bf-border/50">
        <p className="text-xs text-bf-text/60">
          Reviewed by <span className="text-bf-text">{review.reviewedBy}</span>
          <span className="mx-2">•</span>
          {formattedDate}
        </p>
      </div>
    </article>
  );
}

