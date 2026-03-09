import type { MovieSummary, TvSummary } from '../types/movie.types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  items: (MovieSummary | TvSummary)[];
  title?: string;
}

export function MovieGrid({ items, title }: MovieGridProps) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No results found.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      {title && (
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <MovieCard key={`${item.media_type}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
