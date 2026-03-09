export type { WatchlistEntry, NewWatchlistEntry } from '@/db/schema';

// Form values — used with RHF + Zod
export type WatchlistFormValues = {
  status: 'want_to_watch' | 'watching' | 'watched';
  rating: number | null;
  note: string | null;
};
