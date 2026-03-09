import { Suspense } from 'react';
import Link from 'next/link';
import { FilmIcon, ListIcon } from 'lucide-react';
import { auth, signIn, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/features/search/components/SearchBar';

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5 font-semibold">
          <FilmIcon className="size-5" />
          <span className="hidden sm:inline">Movie Tracker</span>
        </Link>

        {/* Search */}
        <div className="flex-1">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {session?.user && (
            <Link
              href="/watchlist"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ListIcon className="size-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </Link>
          )}

          {session?.user ? (
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </form>
          ) : (
            <form
              action={async () => {
                'use server';
                await signIn('github');
              }}
            >
              <Button size="sm">Sign In</Button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}
