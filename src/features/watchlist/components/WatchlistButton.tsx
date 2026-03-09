'use client';

import { useOptimistic, useTransition } from 'react';
import { PlusIcon, XIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '../actions/watchlist.actions';
import { WATCHLIST_STATUS_LABELS } from '../constants/watchlist.constants';
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
      // Instant UI update with all required fields
      setOptimisticEntry({
        id: 'temp',
        userId: '',
        mediaId,
        mediaType,
        title,
        posterPath,
        status: 'want_to_watch',
        rating: null,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
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
      <Button onClick={handleAdd} disabled={isPending} size="lg" className="w-full sm:w-auto">
        <PlusIcon className="size-4" />
        {isPending ? 'Adding...' : 'Add to Watchlist'}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="lg" disabled className="w-full sm:w-auto">
        <CheckIcon className="size-4" />
        {WATCHLIST_STATUS_LABELS[optimisticEntry.status] ?? optimisticEntry.status}
      </Button>
      <Button variant="outline" size="lg" onClick={handleRemove} disabled={isPending}>
        <XIcon className="size-4" />
        {isPending ? 'Removing...' : 'Remove'}
      </Button>
    </div>
  );
}
