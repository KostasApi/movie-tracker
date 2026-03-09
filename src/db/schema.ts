import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const watchlistStatusEnum = pgEnum('watchlist_status', [
  'want_to_watch',
  'watching',
  'watched',
]);

export const watchlistMediaTypeEnum = pgEnum('watchlist_media_type', [
  'movie',
  'tv',
]);

export const watchlistEntries = pgTable('watchlist_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Auth.js session.user.id
  mediaId: integer('media_id').notNull(), // TMDB id
  mediaType: watchlistMediaTypeEnum('media_type').notNull(),
  title: text('title').notNull(),
  posterPath: text('poster_path'),
  status: watchlistStatusEnum('status').notNull(),
  rating: integer('rating'), // 1–5, nullable
  note: text('note'), // nullable
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types inferred from schema
export type WatchlistEntry = typeof watchlistEntries.$inferSelect;
export type NewWatchlistEntry = typeof watchlistEntries.$inferInsert;
