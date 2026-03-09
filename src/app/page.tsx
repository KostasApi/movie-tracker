import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getTrending } from '@/features/movies/services/movie.service';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { MovieGridSkeleton } from '@/features/movies/components/MovieGridSkeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MediaType = 'movie' | 'tv';

const TABS: { value: MediaType; label: string }[] = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
];

async function TrendingResults({ type, page }: { type: MediaType; page: number }) {
  const data = await getTrending(type, 'week', page);

  return (
    <div className="flex flex-col gap-4">
      <MovieGrid items={data.results} />
      {data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {page > 1 ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/?type=${type}&page=${page - 1}`}>
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
              <Link href={`/?type=${type}&page=${page + 1}`}>
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const type: MediaType =
    params.type === 'tv' ? 'tv' : 'movie';
  const page = Math.max(1, Number(params.page) || 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Trending</h1>
          <nav className="flex gap-1 rounded-lg bg-muted p-1">
            {TABS.map((tab) => (
              <Link
                key={tab.value}
                href={`/?type=${tab.value}`}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  type === tab.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <Suspense key={`${type}-${page}`} fallback={<MovieGridSkeleton />}>
          <TrendingResults type={type} page={page} />
        </Suspense>
      </div>
    </main>
  );
}
