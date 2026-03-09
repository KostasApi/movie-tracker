import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { getMovieDetail, getMovieCredits } from '@/features/movies/services/movie.service';
import { getWatchlistEntry } from '@/features/watchlist/queries/watchlist.queries';
import { MovieDetail } from '@/features/movies/components/MovieDetail';
import { MovieModal } from '@/features/movies/components/MovieModal';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';

async function ModalMovieWatchlistButton({ movieId, title, posterPath }: {
  movieId: number;
  title: string;
  posterPath: string | null;
}) {
  const session = await auth();
  const entry = session?.user?.id
    ? await getWatchlistEntry(session.user.id, movieId)
    : null;

  return (
    <WatchlistButton
      mediaId={movieId}
      mediaType="movie"
      title={title}
      posterPath={posterPath}
      initialEntry={entry ?? null}
    />
  );
}

export default async function MovieModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [movie, credits] = await Promise.all([
    getMovieDetail(id),
    getMovieCredits(id),
  ]);

  return (
    <MovieModal title={movie.title}>
      <div className="flex flex-col gap-6">
        <MovieDetail movie={movie} credits={credits} />
        <Suspense>
          <ModalMovieWatchlistButton
            movieId={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
          />
        </Suspense>
      </div>
    </MovieModal>
  );
}
