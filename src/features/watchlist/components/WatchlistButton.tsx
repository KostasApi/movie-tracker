'use client';

import { useOptimistic, useTransition } from 'react';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '../actions/watchlist.actions';
import type { WatchlistEntry } from '@/db/schema';

interface Props {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  initialEntry: WatchlistEntry | null; // passed from Server Component
}

export function WatchlistButton({
  mediaId,
  mediaType,
  title,
  posterPath,
  initialEntry,
}: Props) {
  const [isPending, startTransition] = useTransition();

  // Optimistic state — instantly reflects the expected UI
  // before the Server Action completes
  const [optimisticEntry, setOptimisticEntry] = useOptimistic(initialEntry);

  const handleAdd = () => {
    startTransition(async () => {
      // Instant UI update
      setOptimisticEntry({
        id: 'temp',
        mediaId,
        status: 'want_to_watch',
      } as WatchlistEntry);
      // Actual server mutation
      await addToWatchlist({
        mediaId,
        mediaType,
        title,
        posterPath,
        status: 'want_to_watch',
      });
    });
  };

  const handleRemove = () => {
    if (!optimisticEntry) return;
    startTransition(async () => {
      setOptimisticEntry(null);
      await removeFromWatchlist(optimisticEntry.id);
    });
  };

  if (!optimisticEntry) {
    return (
      <button onClick={handleAdd} disabled={isPending}>
        Add to Watchlist
      </button>
    );
  }

  return (
    <div>
      <span>{optimisticEntry.status}</span>
      <button onClick={handleRemove} disabled={isPending}>
        Remove
      </button>
    </div>
  );
}
