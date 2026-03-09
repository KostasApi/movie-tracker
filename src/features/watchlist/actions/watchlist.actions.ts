'use server';

import { auth } from '@/lib/auth';
import { db } from '@/db';
import { watchlistEntries } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper — throws if unauthenticated
async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  return session.user.id;
}

export async function addToWatchlist(data: {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  status: 'want_to_watch' | 'watching' | 'watched';
  rating?: number | null;
  note?: string | null;
}) {
  const userId = await requireAuth();

  await db.insert(watchlistEntries).values({
    userId,
    ...data,
  });

  revalidatePath('/watchlist');
}

export async function updateWatchlistEntry(
  entryId: string,
  data: {
    status?: 'want_to_watch' | 'watching' | 'watched';
    rating?: number | null;
    note?: string | null;
  },
) {
  const userId = await requireAuth();

  await db
    .update(watchlistEntries)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(watchlistEntries.id, entryId),
        eq(watchlistEntries.userId, userId), // user can only update their own
      ),
    );

  revalidatePath('/watchlist');
}

export async function removeFromWatchlist(entryId: string) {
  const userId = await requireAuth();

  await db
    .delete(watchlistEntries)
    .where(
      and(
        eq(watchlistEntries.id, entryId),
        eq(watchlistEntries.userId, userId),
      ),
    );

  revalidatePath('/watchlist');
}
