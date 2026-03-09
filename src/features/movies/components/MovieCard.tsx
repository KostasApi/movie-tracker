import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from 'lucide-react';
import type { MovieSummary, TvSummary } from '../types/movie.types';

interface MovieCardProps {
  item: MovieSummary | TvSummary;
}

export function MovieCard({ item }: MovieCardProps) {
  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const href = `/${item.media_type}/${item.id}`;

  return (
    <Link href={href} className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight group-hover:underline">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {year && <span>{year}</span>}
          {item.vote_average > 0 && (
            <span className="flex items-center gap-0.5">
              <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
