import { z } from 'zod';

// No cache options here — declared in calling service functions
export async function tmdbFetch<T>(
  endpoint: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const res = await fetch(`${process.env.TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
  return schema.parse(await res.json());
}
