import { searchMulti } from '@/features/movies/services/movie.service';
import { ok, err } from '@/lib/api';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const page = Number(searchParams.get('page') ?? '1');

  if (!q) return err('q is required', 400);
  if (q.length < 2) return err('q must be at least 2 characters', 422);
  if (Number.isNaN(page) || page < 1)
    return err('page must be a positive integer', 422);

  try {
    const results = await searchMulti(q, page);
    return ok(results);
  } catch {
    return err('Failed to search TMDB', 502);
  }
}
