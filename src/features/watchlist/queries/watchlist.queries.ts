import { db } from '@/db';
import { watchlistEntries } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getWatchlistByUser(userId: string) {
  return db.query.watchlistEntries.findMany({
    where: eq(watchlistEntries.userId, userId),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function getWatchlistEntry(userId: string, mediaId: number) {
  return db.query.watchlistEntries.findFirst({
    where: and(
      eq(watchlistEntries.userId, userId),
      eq(watchlistEntries.mediaId, mediaId),
    ),
  });
}
