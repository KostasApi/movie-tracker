import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { StarIcon, TvIcon } from 'lucide-react';
import type { TvDetail as TvDetailType, Credits } from '../types/movie.types';

interface TvDetailProps {
  show: TvDetailType;
  credits: Credits;
}

export function TvDetail({ show, credits }: TvDetailProps) {
  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : null;
  const topCast = credits.cast.slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      {/* Backdrop */}
      {show.backdrop_path && (
        <div className="relative -mx-4 -mt-8 h-48 sm:h-64 md:h-80 lg:h-96">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${show.backdrop_path}`}
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
            {show.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
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
              {show.name}
              {year && (
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  ({year})
                </span>
              )}
            </h1>
            {show.tagline && (
              <p className="mt-1 text-sm italic text-muted-foreground">
                {show.tagline}
              </p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {show.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
                {show.vote_average.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <TvIcon className="size-4" />
              {show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Genres */}
          {show.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {show.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Overview */}
          {show.overview && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {show.overview}
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
