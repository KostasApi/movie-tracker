import { auth } from '@/lib/auth';
import { getMovieDetail, getMovieCredits } from '@/features/movies/services/movie.service';
import { getWatchlistEntry } from '@/features/watchlist/queries/watchlist.queries';
import { MovieDetail } from '@/features/movies/components/MovieDetail';
import { MovieModal } from '@/features/movies/components/MovieModal';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';

export default async function MovieModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [movie, credits] = await Promise.all([
    getMovieDetail(id),
    getMovieCredits(id),
  ]);

  const entry = session?.user?.id
    ? await getWatchlistEntry(session.user.id, movie.id)
    : null;

  return (
    <MovieModal title={movie.title}>
      <div className="flex flex-col gap-6">
        <MovieDetail movie={movie} credits={credits} />
        <WatchlistButton
          mediaId={movie.id}
          mediaType="movie"
          title={movie.title}
          posterPath={movie.poster_path}
          initialEntry={entry ?? null}
        />
      </div>
    </MovieModal>
  );
}
