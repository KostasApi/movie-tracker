import type { Metadata } from 'next';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import {
  getTrending,
  getMovieDetail,
  getMovieCredits,
  getSimilar,
} from '@/features/movies/services/movie.service';
import { getWatchlistEntry } from '@/features/watchlist/queries/watchlist.queries';
import { MovieDetail } from '@/features/movies/components/MovieDetail';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const trending = await getTrending('movie', 'week');
  return trending.results.slice(0, 20).map((m) => ({ id: String(m.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetail(id);
  return {
    title: `${movie.title} — Movie Tracker`,
    description: movie.overview,
    openGraph: movie.backdrop_path
      ? { images: [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`] }
      : undefined,
  };
}

async function MovieWatchlistButton({ movieId, title, posterPath }: {
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

export default async function MoviePage({ params }: Props) {
  const { id } = await params;

  const [movie, credits, similar] = await Promise.all([
    getMovieDetail(id),
    getMovieCredits(id),
    getSimilar(id, 'movie'),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8">
        <MovieDetail movie={movie} credits={credits} />

        <Suspense>
          <MovieWatchlistButton
            movieId={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
          />
        </Suspense>

        {similar.results.length > 0 && (
          <MovieGrid title="Similar Movies" items={similar.results} />
        )}
      </div>
    </main>
  );
}
