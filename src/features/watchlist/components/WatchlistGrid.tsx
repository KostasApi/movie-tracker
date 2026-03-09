'use client';

import { useOptimistic, useTransition } from 'react';
import { removeFromWatchlist } from '../actions/watchlist.actions';
import type { WatchlistEntry } from '@/db/schema';

export function WatchlistGrid({ entries }: { entries: WatchlistEntry[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticEntries, removeOptimistic] = useOptimistic(
    entries,
    (state, idToRemove: string) => state.filter((e) => e.id !== idToRemove),
  );

  const handleRemove = (id: string) => {
    startTransition(async () => {
      removeOptimistic(id); // instant UI
      await removeFromWatchlist(id); // server round-trip
    });
  };

  return (
    <div>
      {optimisticEntries.map((entry) => (
        <div key={entry.id}>
          {/* poster, title, status, rating, note */}
          <button onClick={() => handleRemove(entry.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
