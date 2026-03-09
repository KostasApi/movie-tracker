import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ClockIcon } from 'lucide-react';
import type { MovieDetail as MovieDetailType, Credits } from '../types/movie.types';

interface MovieDetailProps {
  movie: MovieDetailType;
  credits: Credits;
}

export function MovieDetail({ movie, credits }: MovieDetailProps) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : null;
  const minutes = movie.runtime ? movie.runtime % 60 : null;
  const director = credits.crew.find((c) => c.job === 'Director');
  const topCast = credits.cast.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative -mx-4 -mt-8 h-48 sm:h-64 md:h-80 lg:h-96">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Main info */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Poster */}
        <div className="shrink-0 self-center sm:self-start">
          <div className="relative aspect-[2/3] w-40 overflow-hidden rounded-lg shadow-lg sm:w-48">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="192px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {movie.title}
              {year && (
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  ({year})
                </span>
              )}
            </h1>
            {movie.tagline && (
              <p className="mt-1 text-sm italic text-muted-foreground">
                {movie.tagline}
              </p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
            {movie.runtime && (
              <span className="flex items-center gap-1">
                <ClockIcon className="size-4" />
                {hours}h {minutes}m
              </span>
            )}
            {director && <span>Directed by {director.name}</span>}
          </div>

          {/* Genres */}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Overview */}
          {movie.overview && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {movie.overview}
            </p>
          )}
        </div>
      </div>

      {/* Cast */}
      {topCast.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Cast</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {topCast.map((member) => (
              <div key={member.id} className="flex flex-col items-center gap-1.5 text-center">
                <div className="relative size-20 overflow-hidden rounded-full bg-muted">
                  {member.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                      alt={member.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium leading-tight">{member.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {member.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
