import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { searchMulti } from '@/features/movies/services/movie.service';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { MovieGridSkeleton } from '@/features/movies/components/MovieGridSkeleton';
import { Button } from '@/components/ui/button';

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
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {page > 1 ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}>
                <ChevronLeftIcon className="size-4" />
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeftIcon className="size-4" />
              Previous
            </Button>
          )}

          <span>
            Page {data.page} of {data.total_pages}
          </span>

          {page < data.total_pages ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}>
                Next
                <ChevronRightIcon className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          )}
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
        <h1 className="text-2xl font-bold tracking-tight">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>

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
