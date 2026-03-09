import { Suspense } from 'react';
import Link from 'next/link';
import { getTrending } from '@/features/movies/services/movie.service';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { MovieGridSkeleton } from '@/features/movies/components/MovieGridSkeleton';
import { cn } from '@/lib/utils';

type MediaType = 'movie' | 'tv';

const TABS: { value: MediaType; label: string }[] = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
];

async function TrendingResults({ type }: { type: MediaType }) {
  const data = await getTrending(type);
  return <MovieGrid items={data.results} />;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type: MediaType =
    params.type === 'tv' ? 'tv' : 'movie';

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

        <Suspense key={type} fallback={<MovieGridSkeleton />}>
          <TrendingResults type={type} />
        </Suspense>
      </div>
    </main>
  );
}
