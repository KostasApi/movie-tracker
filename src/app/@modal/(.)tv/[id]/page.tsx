import { auth } from '@/lib/auth';
import { getTvDetail, getTvCredits } from '@/features/movies/services/movie.service';
import { getWatchlistEntry } from '@/features/watchlist/queries/watchlist.queries';
import { TvDetail } from '@/features/movies/components/TvDetail';
import { MovieModal } from '@/features/movies/components/MovieModal';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';

export default async function TvModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [show, credits] = await Promise.all([
    getTvDetail(id),
    getTvCredits(id),
  ]);

  const entry = session?.user?.id
    ? await getWatchlistEntry(session.user.id, show.id)
    : null;

  return (
    <MovieModal title={show.name}>
      <div className="flex flex-col gap-6">
        <TvDetail show={show} credits={credits} />
        <WatchlistButton
          mediaId={show.id}
          mediaType="tv"
          title={show.name}
          posterPath={show.poster_path}
          initialEntry={entry ?? null}
        />
      </div>
    </MovieModal>
  );
}
