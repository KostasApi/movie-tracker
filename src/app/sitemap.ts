import type { MetadataRoute } from 'next';
import { getTrending } from '@/features/movies/services/movie.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trendingMovies, trendingTv] = await Promise.all([
    getTrending('movie', 'week'),
    getTrending('tv', 'week'),
  ]);

  const movieEntries: MetadataRoute.Sitemap = trendingMovies.results.map(
    (movie) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
  );

  const tvEntries: MetadataRoute.Sitemap = trendingTv.results.map((show) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tv/${show.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...movieEntries,
    ...tvEntries,
  ];
}
