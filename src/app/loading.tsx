import { MovieGridSkeleton } from '@/features/movies/components/MovieGridSkeleton';

export default function HomeLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <MovieGridSkeleton />
      </div>
    </main>
  );
}
