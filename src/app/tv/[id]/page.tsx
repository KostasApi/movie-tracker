import type { Metadata } from 'next';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import {
  getTrending,
  getTvDetail,
  getTvCredits,
  getSimilar,
} from '@/features/movies/services/movie.service';
import { getWatchlistEntry } from '@/features/watchlist/queries/watchlist.queries';
import { TvDetail } from '@/features/movies/components/TvDetail';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const trending = await getTrending('tv', 'week');
  return trending.results.slice(0, 20).map((s) => ({ id: String(s.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const show = await getTvDetail(id);
  return {
    title: `${show.name} — Movie Tracker`,
    description: show.overview,
    openGraph: show.backdrop_path
      ? { images: [`https://image.tmdb.org/t/p/w1280${show.backdrop_path}`] }
      : undefined,
  };
}

async function TvWatchlistButton({ showId, title, posterPath }: {
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

export default async function TvPage({ params }: Props) {
  const { id } = await params;

  const [show, credits, similar] = await Promise.all([
    getTvDetail(id),
    getTvCredits(id),
    getSimilar(id, 'tv'),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8">
        <TvDetail show={show} credits={credits} />

        <Suspense>
          <TvWatchlistButton
            showId={show.id}
            title={show.name}
            posterPath={show.poster_path}
          />
        </Suspense>

        {similar.results.length > 0 && (
          <MovieGrid title="Similar Shows" items={similar.results} />
        )}
      </div>
    </main>
  );
}
