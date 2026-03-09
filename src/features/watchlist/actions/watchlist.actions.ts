'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { watchlistEntries } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Validation Schemas ---

const addToWatchlistSchema = z.object({
  mediaId: z.number().int().positive(),
  mediaType: z.enum(['movie', 'tv']),
  title: z.string().min(1).max(500),
  posterPath: z.string().nullable(),
  status: z.enum(['want_to_watch', 'watching', 'watched']),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
});

const updateWatchlistSchema = z.object({
  status: z.enum(['want_to_watch', 'watching', 'watched']).optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
});

// --- Auth Helper ---

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  return session.user.id;
}

// --- Actions ---

export async function addToWatchlist(input: z.input<typeof addToWatchlistSchema>) {
  const userId = await requireAuth();
  const data = addToWatchlistSchema.parse(input);

  await db.insert(watchlistEntries).values({
    userId,
    ...data,
  });

  revalidatePath('/watchlist');
}

export async function updateWatchlistEntry(
  entryId: string,
  input: z.input<typeof updateWatchlistSchema>,
) {
  const userId = await requireAuth();
  const data = updateWatchlistSchema.parse(input);

  const result = await db
    .update(watchlistEntries)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(
        eq(watchlistEntries.id, entryId),
        eq(watchlistEntries.userId, userId),
      ),
    );

  if (result.rowCount === 0) {
    throw new Error('Entry not found or not authorized');
  }

  revalidatePath('/watchlist');
}

export async function removeFromWatchlist(entryId: string) {
  const userId = await requireAuth();

  const result = await db
    .delete(watchlistEntries)
    .where(
      and(
        eq(watchlistEntries.id, entryId),
        eq(watchlistEntries.userId, userId),
      ),
    );

  if (result.rowCount === 0) {
    throw new Error('Entry not found or not authorized');
  }

  revalidatePath('/watchlist');
}
