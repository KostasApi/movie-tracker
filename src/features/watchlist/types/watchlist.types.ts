export type { WatchlistEntry, NewWatchlistEntry } from '@/db/schema';
export type { watchlistStatusEnum } from '@/db/schema';

// Derive status type from the database enum to keep a single source of truth
import type { watchlistEntries } from '@/db/schema';
export type WatchlistStatus = typeof watchlistEntries.$inferSelect['status'];

// Form values — used with RHF + Zod
export type WatchlistFormValues = {
  status: WatchlistStatus;
  rating: number | null;
  note: string | null;
};
