import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getWatchlistByUser } from '@/features/watchlist/queries/watchlist.queries';
import { WatchlistGrid } from '@/features/watchlist/components/WatchlistGrid';
import { WATCHLIST_STATUS_LABELS } from '@/features/watchlist/constants/watchlist.constants';
import type { WatchlistStatus } from '@/features/watchlist/types/watchlist.types';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My Watchlist — Movie Tracker',
};

const FILTERS: { value: WatchlistStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  ...(Object.entries(WATCHLIST_STATUS_LABELS) as [WatchlistStatus, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const params = await searchParams;
  const entries = await getWatchlistByUser(session.user.id);

  const status = params.status as WatchlistStatus | undefined;
  const filtered = status
    ? entries.filter((e) => e.status === status)
    : entries;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Watchlist</h1>
          <nav className="flex gap-1 rounded-lg bg-muted p-1">
            {FILTERS.map((filter) => {
              const isActive =
                filter.value === 'all' ? !status : status === filter.value;
              return (
                <Link
                  key={filter.value}
                  href={
                    filter.value === 'all'
                      ? '/watchlist'
                      : `/watchlist?status=${filter.value}`
                  }
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {filter.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {filtered.length > 0 ? (
          <WatchlistGrid entries={filtered} />
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            {status
              ? 'No entries with this status.'
              : 'Your watchlist is empty. Start adding movies and shows!'}
          </p>
        )}
      </div>
    </main>
  );
}
