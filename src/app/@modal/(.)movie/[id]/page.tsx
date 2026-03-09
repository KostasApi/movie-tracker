import {
  getMovieDetail,
  getMovieCredits,
} from '@/features/movies/services/movie.service';
import { MovieDetail } from '@/features/movies/components/MovieDetail';
import { MovieModal } from '@/features/movies/components/MovieModal';

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
    <MovieModal title={movie.title} href={`/movie/${id}`}>
      <MovieDetail movie={movie} credits={credits} />
    </MovieModal>
  );
}
