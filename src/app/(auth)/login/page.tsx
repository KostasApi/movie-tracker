import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FilmIcon } from 'lucide-react';
import { auth, signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Sign In — Movie Tracker',
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');

  return (
    <main className="mx-auto flex max-w-sm flex-col items-center gap-6 px-4 py-24">
      <div className="flex flex-col items-center gap-2">
        <FilmIcon className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Sign in to Movie Tracker</h1>
        <p className="text-center text-sm text-muted-foreground">
          Sign in to save movies and TV shows to your personal watchlist.
        </p>
      </div>

      <form
        action={async () => {
          'use server';
          await signIn('github', { redirectTo: '/' });
        }}
      >
        <Button size="lg" className="w-full">
          Continue with GitHub
        </Button>
      </form>
    </main>
  );
}
