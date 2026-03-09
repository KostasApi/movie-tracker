import { getTrending } from '@/features/movies/services/movie.service';
import { ok, err } from '@/lib/api';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'movie';
  const window = searchParams.get('window') ?? 'week';

  if (!['movie', 'tv'].includes(type))
    return err('type must be movie or tv', 422);
  if (!['day', 'week'].includes(window))
    return err('window must be day or week', 422);

  try {
    const results = await getTrending(
      type as 'movie' | 'tv',
      window as 'day' | 'week',
    );
    return ok(results);
  } catch {
    return err('Failed to fetch trending content', 502);
  }
}
