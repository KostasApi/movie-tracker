'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TvError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Failed to load TV show</h1>
      <p className="text-muted-foreground">
        {error.message || 'Could not fetch TV show details. Please try again.'}
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
