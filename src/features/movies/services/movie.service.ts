import { cacheLife, cacheTag } from 'next/cache';
import { tmdbFetch } from '@/lib/tmdb';
import {
  MovieSummarySchema,
  MovieDetailSchema,
  TvSummarySchema,
  TvDetailSchema,
  CreditsSchema,
  SearchResultSchema,
  paginatedResponse,
} from '../types/movie.types';

export async function getTrending(
  type: 'movie' | 'tv' = 'movie',
  window: 'day' | 'week' = 'week',
) {
  'use cache';
  cacheLife('hours');
  cacheTag('trending');
  if (type === 'movie') {
    return tmdbFetch(
      `/trending/movie/${window}`,
      paginatedResponse(MovieSummarySchema),
    );
  }
  return tmdbFetch(
    `/trending/tv/${window}`,
    paginatedResponse(TvSummarySchema),
  );
}

export async function searchMulti(q: string, page = 1) {
  return tmdbFetch(
    `/search/multi?query=${encodeURIComponent(q)}&page=${page}`,
    paginatedResponse(SearchResultSchema),
  );
}

export async function getMovieDetail(id: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`movie-${id}`);
  return tmdbFetch(`/movie/${id}`, MovieDetailSchema);
}

export async function getTvDetail(id: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`tv-${id}`);
  return tmdbFetch(`/tv/${id}`, TvDetailSchema);
}

export async function getMovieCredits(id: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`movie-${id}`);
  return tmdbFetch(`/movie/${id}/credits`, CreditsSchema);
}

export async function getTvCredits(id: string) {
  'use cache';
  cacheLife('days');
  cacheTag(`tv-${id}`);
  return tmdbFetch(`/tv/${id}/credits`, CreditsSchema);
}

export async function getSimilar(id: string, type: 'movie' | 'tv') {
  'use cache';
  cacheLife('days');
  cacheTag(`similar-${id}`);
  if (type === 'movie') {
    return tmdbFetch(
      `/movie/${id}/similar`,
      paginatedResponse(MovieSummarySchema),
    );
  }
  return tmdbFetch(
    `/tv/${id}/similar`,
    paginatedResponse(TvSummarySchema),
  );
}
