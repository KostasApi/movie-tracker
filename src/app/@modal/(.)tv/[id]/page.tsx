import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { getTvDetail, getTvCredits } from '@/features/movies/services/movie.service';
import { getWatchlistEntry } from '@/features/watchlist/queries/watchlist.queries';
import { TvDetail } from '@/features/movies/components/TvDetail';
import { MovieModal } from '@/features/movies/components/MovieModal';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';

async function ModalTvWatchlistButton({ showId, title, posterPath }: {
  showId: number;
  title: string;
  posterPath: string | null;
}) {
  const session = await auth();
  const entry = session?.user?.id
    ? await getWatchlistEntry(session.user.id, showId)
    : null;

  return (
    <WatchlistButton
      mediaId={showId}
      mediaType="tv"
      title={title}
      posterPath={posterPath}
      initialEntry={entry ?? null}
    />
  );
}

export default async function TvModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [show, credits] = await Promise.all([
    getTvDetail(id),
    getTvCredits(id),
  ]);

  return (
    <MovieModal title={show.name}>
      <div className="flex flex-col gap-6">
        <TvDetail show={show} credits={credits} />
        <Suspense>
          <ModalTvWatchlistButton
            showId={show.id}
            title={show.name}
            posterPath={show.poster_path}
          />
        </Suspense>
      </div>
    </MovieModal>
  );
}
