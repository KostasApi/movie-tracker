import { z } from 'zod';

// --- Shared ---

const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// --- Movie ---

export const MovieSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  media_type: z.literal('movie').default('movie'),
});

export const MovieDetailSchema = MovieSummarySchema.extend({
  overview: z.string(),
  genres: z.array(GenreSchema),
  runtime: z.number().nullable(),
  tagline: z.string(),
  backdrop_path: z.string().nullable(),
});

// --- TV ---

export const TvSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  poster_path: z.string().nullable(),
  first_air_date: z.string(),
  vote_average: z.number(),
  media_type: z.literal('tv').default('tv'),
});

export const TvDetailSchema = TvSummarySchema.extend({
  overview: z.string(),
  genres: z.array(GenreSchema),
  number_of_seasons: z.number(),
  tagline: z.string(),
  backdrop_path: z.string().nullable(),
});

// --- Person (search results include people) ---

export const PersonSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  media_type: z.literal('person'),
  profile_path: z.string().nullable(),
  known_for_department: z.string().optional(),
});

// --- Search (mixed results) ---

export const SearchResultSchema = z.union([
  MovieSummarySchema,
  TvSummarySchema,
  PersonSummarySchema,
]);

// --- Credits ---

const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
});

const CrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
});

export const CreditsSchema = z.object({
  id: z.number(),
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
});

// --- Paginated ---

export function paginatedResponse<T extends z.ZodType>(schema: T) {
  return z.object({
    results: z.array(schema),
    page: z.number(),
    total_pages: z.number(),
    total_results: z.number(),
  });
}

// --- Inferred Types ---

export type MovieSummary = z.infer<typeof MovieSummarySchema>;
export type MovieDetail = z.infer<typeof MovieDetailSchema>;
export type TvSummary = z.infer<typeof TvSummarySchema>;
export type TvDetail = z.infer<typeof TvDetailSchema>;
export type PaginatedResponse<T> = {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
};
export type PersonSummary = z.infer<typeof PersonSummarySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type Credits = z.infer<typeof CreditsSchema>;
