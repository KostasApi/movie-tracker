import {
  getTvDetail,
  getTvCredits,
} from '@/features/movies/services/movie.service';
import { TvDetail } from '@/features/movies/components/TvDetail';
import { MovieModal } from '@/features/movies/components/MovieModal';

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
    <MovieModal title={show.name} href={`/tv/${id}`}>
      <TvDetail show={show} credits={credits} />
    </MovieModal>
  );
}
