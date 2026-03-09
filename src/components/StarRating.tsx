'use client';

import { StarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number | null;
  onChange?: (value: number | null) => void;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
  const handleClick = (star: number) => {
    if (readOnly || !onChange) return;
    // Clicking the same star again clears the rating
    onChange(value === star ? null : star);
  };

  return (
    <fieldset className="flex gap-0.5 border-none p-0" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => handleClick(star)}
          className={cn(
            'p-0.5 transition-colors',
            !readOnly && 'cursor-pointer hover:text-yellow-400',
            readOnly && 'cursor-default',
          )}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <StarIcon
            className={cn(
              'size-5',
              value !== null && star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-muted-foreground',
            )}
          />
        </button>
      ))}
    </fieldset>
  );
}
