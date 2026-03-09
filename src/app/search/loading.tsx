import { MovieGridSkeleton } from '@/features/movies/components/MovieGridSkeleton';

export default function SearchLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
        <MovieGridSkeleton />
      </div>
    </main>
  );
}
