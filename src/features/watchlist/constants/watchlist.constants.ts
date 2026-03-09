import type { WatchlistStatus } from '../types/watchlist.types';

export const WATCHLIST_STATUS_LABELS: Record<WatchlistStatus, string> = {
  want_to_watch: 'Want to Watch',
  watching: 'Watching',
  watched: 'Watched',
};
