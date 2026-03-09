'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useOptimistic, useTransition } from 'react';
import { XIcon, StarIcon } from 'lucide-react';
import { removeFromWatchlist } from '../actions/watchlist.actions';
import { RatingForm } from './RatingForm';
import { WATCHLIST_STATUS_LABELS } from '../constants/watchlist.constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { WatchlistEntry } from '@/db/schema';

export function WatchlistGrid({ entries }: { entries: WatchlistEntry[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticEntries, removeOptimistic] = useOptimistic(
    entries,
    (state, idToRemove: string) => state.filter((e) => e.id !== idToRemove),
  );

  const handleRemove = (id: string) => {
    startTransition(async () => {
      removeOptimistic(id);
      await removeFromWatchlist(id);
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {optimisticEntries.map((entry) => (
        <div key={entry.id} className="group flex flex-col gap-2">
          {/* Poster */}
          <Link
            href={`/${entry.mediaType}/${entry.mediaId}`}
            className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted"
          >
            {entry.posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${entry.posterPath}`}
                alt={entry.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No Image
              </div>
            )}
          </Link>

          {/* Info */}
          <div className="flex flex-col gap-1">
            <Link
              href={`/${entry.mediaType}/${entry.mediaId}`}
              className="line-clamp-2 text-sm font-medium leading-tight hover:underline"
            >
              {entry.title}
            </Link>

            <Badge variant="outline" className="w-fit text-xs">
              {WATCHLIST_STATUS_LABELS[entry.status] ?? entry.status}
            </Badge>

            {entry.rating && (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: entry.rating }, (_, i) => (
                  <StarIcon
                    key={i}
                    className="size-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            )}

            {entry.note && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {entry.note}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <RatingForm
              entryId={entry.id}
              initialValues={{
                status: entry.status,
                rating: entry.rating,
                note: entry.note,
              }}
              title={entry.title}
            >
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Edit
              </Button>
            </RatingForm>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(entry.id)}
              disabled={isPending}
            >
              <XIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
