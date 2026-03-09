import { Skeleton } from '@/components/ui/skeleton';
import { MovieGridSkeleton } from '@/features/movies/components/MovieGridSkeleton';

export default function TvDetailLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8">
        <Skeleton className="-mx-4 -mt-8 h-48 sm:h-64 md:h-80 lg:h-96" />
        <div className="flex flex-col gap-6 sm:flex-row">
          <Skeleton className="aspect-[2/3] w-40 shrink-0 self-center rounded-lg sm:w-48 sm:self-start" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <MovieGridSkeleton count={5} />
      </div>
    </main>
  );
}
