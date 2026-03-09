import { Suspense } from 'react';
import { searchMulti } from '@/features/movies/services/movie.service';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { MovieGridSkeleton } from '@/features/movies/components/MovieGridSkeleton';
import { SearchBar } from '@/features/search/components/SearchBar';

async function SearchResults({ query, page }: { query: string; page: number }) {
  const data = await searchMulti(query, page);

  // Filter out person results — only show movies and TV
  const mediaResults = data.results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv',
  );

  return (
    <div className="flex flex-col gap-4">
      <MovieGrid items={mediaResults} />
      {data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          Page {data.page} of {data.total_pages}
        </div>
      )}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const page = Math.max(1, Number(params.page) || 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>

        <Suspense>
          <SearchBar />
        </Suspense>

        {query ? (
          <Suspense key={`${query}-${page}`} fallback={<MovieGridSkeleton />}>
            <SearchResults query={query} page={page} />
          </Suspense>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            Search for movies and TV shows to get started.
          </p>
        )}
      </div>
    </main>
  );
}
