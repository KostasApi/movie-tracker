# Next.js Topics Covered — Movie Tracker

A reference guide mapping Next.js concepts to their implementations in this project.
Use this alongside the source code to study how each feature works in practice.

---

## Table of Contents

1. [App Router & File-Based Routing](#1-app-router--file-based-routing)
2. [Layouts](#2-layouts)
3. [Server Components](#3-server-components)
4. [Client Components](#4-client-components)
5. [Dynamic Routes](#5-dynamic-routes)
6. [Parallel Routes](#6-parallel-routes)
7. [Intercepting Routes](#7-intercepting-routes)
8. [Loading States (Streaming UI)](#8-loading-states-streaming-ui)
9. [Error Boundaries](#9-error-boundaries)
10. [Custom 404 Page](#10-custom-404-page)
11. [Server Actions](#11-server-actions)
12. [API Route Handlers](#12-api-route-handlers)
13. [Data Fetching (Server-Side)](#13-data-fetching-server-side)
14. [Caching (`use cache`)](#14-caching-use-cache)
15. [Suspense Boundaries](#15-suspense-boundaries)
16. [searchParams & URL State](#16-searchparams--url-state)
17. [generateStaticParams (Static Generation)](#17-generatestaticparams-static-generation)
18. [generateMetadata (Dynamic SEO)](#18-generatemetadata-dynamic-seo)
19. [Middleware](#19-middleware)
20. [Authentication (Auth.js v5)](#20-authentication-authjs-v5)
21. [Database (Drizzle ORM + Neon)](#21-database-drizzle-orm--neon)
22. [Image Optimization](#22-image-optimization)
23. [Font Optimization](#23-font-optimization)
24. [Revalidation (On-Demand)](#24-revalidation-on-demand)
25. [React 19 Patterns](#25-react-19-patterns)
26. [Form Handling (React Hook Form + Zod)](#26-form-handling-react-hook-form--zod)
27. [Path Aliases](#27-path-aliases)
28. [React Compiler](#28-react-compiler)
29. [Environment Variables](#29-environment-variables)
30. [Catch-All Routes](#30-catch-all-routes)
31. [Feature-Based Project Structure](#31-feature-based-project-structure)
32. [Link Component & Client-Side Navigation](#32-link-component--client-side-navigation)
33. [Partial Prerendering (PPR)](#33-partial-prerendering-ppr)
34. [Server-Side Redirects (`redirect` & `notFound`)](#34-server-side-redirects-redirect--notfound)
35. [Server/Client Composition Pattern](#35-serverclient-composition-pattern)
36. [Route Groups](#36-route-groups)
37. [Sitemap & Robots](#37-sitemap--robots)
38. [Dynamic Imports (`next/dynamic`)](#38-dynamic-imports-nextdynamic)
39. [Instrumentation](#39-instrumentation)

---

## 1. App Router & File-Based Routing

Every file inside `src/app/` maps to a URL route. Pages are defined by `page.tsx` files.

| Route          | File                               |
|----------------|------------------------------------|
| `/`            | `src/app/page.tsx`                 |
| `/search`      | `src/app/search/page.tsx`          |
| `/movie/[id]`  | `src/app/movie/[id]/page.tsx`      |
| `/tv/[id]`     | `src/app/tv/[id]/page.tsx`         |
| `/watchlist`   | `src/app/watchlist/page.tsx`       |

**Key takeaway:** No router configuration needed — the folder structure **is** the router.

---

## 2. Layouts

A layout wraps all pages and persists across navigations (does not re-render on route changes).

**File:** `src/app/layout.tsx`

```tsx
export default function RootLayout({ children, modal }: {
  children: React.ReactNode;
  modal: React.ReactNode;    // ← parallel route slot
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        {modal}             {/* ← rendered alongside children */}
      </body>
    </html>
  );
}
```

**What to study:**
- The layout receives `children` (current page) plus any parallel route slots (here: `modal`)
- Static metadata is exported at the layout level
- The `Navbar` persists across all pages without re-mounting

---

## 3. Server Components

By default, every component in the App Router is a **Server Component**. They run on the server only, can be `async`, and can directly access databases, APIs, and secrets.

**Files:**
- `src/app/page.tsx` — async page that fetches trending data
- `src/app/watchlist/page.tsx` — reads auth session + queries database
- `src/components/Navbar.tsx` — async component calling `auth()`
- `src/app/movie/[id]/page.tsx` — fetches movie details, credits, and similar movies in parallel

```tsx
// src/app/page.tsx (Server Component — no 'use client')
async function TrendingResults({ type, page }) {
  const data = await getTrending(type, 'week', page);  // direct server call
  return <MovieGrid items={data.results} />;
}
```

**Key takeaway:** Server Components can use `await`, access `process.env`, and call databases directly — no API layer needed for data fetching.

---

## 4. Client Components

Components that need interactivity (hooks, event handlers, browser APIs) must start with `'use client'`.

**Files:**
- `src/features/watchlist/components/WatchlistButton.tsx` — uses `useOptimistic`, `useTransition`
- `src/features/watchlist/components/RatingForm.tsx` — uses `useForm`, `useState`
- `src/features/search/components/SearchBar.tsx` — uses `useSearch` custom hook
- `src/features/movies/components/MovieModal.tsx` — uses `useRouter`
- `src/app/error.tsx` — error boundaries must be client components

```tsx
'use client';  // ← marks the client boundary

import { useOptimistic, useTransition } from 'react';

export function WatchlistButton({ initialEntry }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticEntry, setOptimisticEntry] = useOptimistic(initialEntry);
  // ...
}
```

**Key takeaway:** Only add `'use client'` when you need React hooks or browser APIs. Push client boundaries as deep in the tree as possible to maximize server rendering.

---

## 5. Dynamic Routes

Brackets `[param]` in folder names create dynamic route segments.

**Files:**
- `src/app/movie/[id]/page.tsx` — movie detail by ID
- `src/app/tv/[id]/page.tsx` — TV show detail by ID

```tsx
// In Next.js 16, params is a Promise that must be awaited
type Props = { params: Promise<{ id: string }> };

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieDetail(id);
  // ...
}
```

**Key takeaway:** In Next.js 15+, `params` is a `Promise` and must be `await`ed. The `[id]` folder segment becomes `params.id`.

---

## 6. Parallel Routes

Folders prefixed with `@` define **parallel route slots** — segments rendered simultaneously in the same layout.

**Files:**
- `src/app/@modal/default.tsx` — returns `null` when no modal is active
- `src/app/@modal/(.)movie/[id]/page.tsx` — movie modal content
- `src/app/@modal/(.)tv/[id]/page.tsx` — TV modal content
- `src/app/layout.tsx` — receives `modal` as a prop

```tsx
// layout.tsx — parallel slot received as prop
export default function RootLayout({ children, modal }) {
  return (
    <body>
      {children}
      {modal}   {/* ← renders the @modal slot */}
    </body>
  );
}
```

```tsx
// @modal/default.tsx — required default for inactive state
export default function ModalDefault() {
  return null;
}
```

**Key takeaway:** The `@modal` folder creates a "slot" in the layout. `default.tsx` is required to render when the slot has no matching route.

---

## 7. Intercepting Routes

The `(.)` prefix intercepts a route from the current level, rendering it in a modal overlay instead of a full-page navigation.

**Files:**
- `src/app/@modal/(.)movie/[id]/page.tsx` — intercepts `/movie/[id]`
- `src/app/@modal/(.)tv/[id]/page.tsx` — intercepts `/tv/[id]`
- `src/features/movies/components/MovieModal.tsx` — Dialog wrapper

**How it works:**
1. User clicks a movie card link (`/movie/123`) from the home page
2. Instead of full navigation, the `@modal/(.)movie/[id]` route matches
3. The movie detail opens in a Dialog overlay as a quick preview
4. A "View full page" link navigates to the actual detail page
5. If the user navigates directly to `/movie/123` (hard refresh or URL), the full page renders

```tsx
// MovieModal.tsx — closes modal by navigating back, links to full page
'use client';
export function MovieModal({ title, href, children }) {
  const router = useRouter();
  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent>
        {children}
        {/* Plain <a> to bypass intercepting route and load the full detail page */}
        <a href={href}>View full page</a>
      </DialogContent>
    </Dialog>
  );
}
```

**Important caveat:** The modal is a lightweight preview — it intentionally excludes mutations (e.g., "Add to Watchlist"). Server Actions that call `revalidatePath()` trigger a router refresh that destroys the intercepted route state, causing the modal to close and the full page to render instead. Keep mutations on the full detail page only.

**Key takeaway:** Intercepting routes enable the Instagram-style modal pattern — click opens a modal, direct URL opens a full page. Use a plain `<a>` tag (not `Link`) for the "View full page" link to force a full navigation that bypasses the intercepting route. Avoid Server Actions with `revalidatePath` inside modals.

---

## 8. Loading States (Streaming UI)

A `loading.tsx` file in any route folder automatically shows while the page loads. This leverages React Suspense and streaming under the hood.

**Files:**
- `src/app/loading.tsx` — home page skeleton
- `src/app/search/loading.tsx` — search skeleton
- `src/app/movie/[id]/loading.tsx` — movie detail skeleton
- `src/app/tv/[id]/loading.tsx` — TV detail skeleton
- `src/app/watchlist/loading.tsx` — watchlist skeleton
- `src/features/movies/components/MovieGridSkeleton.tsx` — reusable skeleton grid

```tsx
// src/app/loading.tsx
export default function HomeLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      <MovieGridSkeleton />
    </main>
  );
}
```

**Key takeaway:** Just add a `loading.tsx` to any route folder — Next.js wraps your page in a Suspense boundary automatically and shows the loading state while the server streams the response.

---

## 9. Error Boundaries

An `error.tsx` file catches errors in its route segment. Must be a Client Component.

**Files:**
- `src/app/error.tsx` — global error boundary
- `src/app/movie/[id]/error.tsx` — movie-specific error
- `src/app/tv/[id]/error.tsx` — TV-specific error

```tsx
'use client';  // ← required

export default function GlobalError({
  error,
  reset,    // ← call to retry rendering
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

**Key takeaway:** Error boundaries are scoped to their route segment. A movie error won't break the whole app — the Navbar and other segments stay intact.

---

## 10. Custom 404 Page

**File:** `src/app/not-found.tsx`

```tsx
export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/">Go home</Link>
    </main>
  );
}
```

**Key takeaway:** Place `not-found.tsx` in `app/` for a global 404 page. You can also call `notFound()` from any Server Component to trigger it programmatically.

---

## 11. Server Actions

Functions marked with `'use server'` run on the server but can be called from Client Components. They replace traditional API endpoints for mutations.

**File:** `src/features/watchlist/actions/watchlist.actions.ts`

```tsx
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function addToWatchlist(input) {
  const userId = await requireAuth();       // verify auth
  const data = addToWatchlistSchema.parse(input); // validate with Zod

  // Prevent duplicates at the data layer
  const existing = await db.query.watchlistEntries.findFirst({
    where: and(eq(watchlistEntries.userId, userId), eq(watchlistEntries.mediaId, data.mediaId)),
  });
  if (existing) return;

  await db.insert(watchlistEntries).values({ userId, ...data });
  revalidatePath('/watchlist');              // refresh cached page
}
```

**Consumed in Client Component:** `src/features/watchlist/components/WatchlistButton.tsx`

```tsx
'use client';
import { addToWatchlist } from '../actions/watchlist.actions';

// Called directly from event handler
await addToWatchlist({ mediaId, mediaType, title, posterPath, status: 'want_to_watch' });
```

**Inline Server Actions in forms:** `src/components/Navbar.tsx`

```tsx
<form action={async () => {
  'use server';
  await signOut();
}}>
  <Button>Sign Out</Button>
</form>
```

**Key takeaway:** Server Actions eliminate the need for API routes for mutations. They handle auth, validation, database writes, and cache invalidation in one place. Use standalone files for complex logic, inline `'use server'` for simple form actions.

---

## 12. API Route Handlers

`route.ts` files define REST API endpoints using standard `Request`/`Response` objects.

**Files:**
- `src/app/api/movies/trending/route.ts` — `GET /api/movies/trending`
- `src/app/api/movies/search/route.ts` — `GET /api/movies/search`
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js handler

```tsx
// src/app/api/movies/trending/route.ts
import { ok, err } from '@/lib/api';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'movie';

  if (!['movie', 'tv'].includes(type))
    return err('type must be movie or tv', 422);

  const results = await getTrending(type as 'movie' | 'tv', 'week');
  return ok(results);
}
```

**Helper utilities:** `src/lib/api.ts`

```tsx
export function ok<T>(data: T, status = 200): Response {
  return Response.json({ data }, { status });
}
export function err(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}
```

**Key takeaway:** Use Route Handlers for public APIs consumed by external clients. For same-app mutations, prefer Server Actions instead. Export named functions matching HTTP methods (`GET`, `POST`, etc.).

---

## 13. Data Fetching (Server-Side)

Server Components fetch data directly — no `useEffect`, no client-side fetching, no loading spinners for initial content.

**Pattern:** Service function → Server Component → renders with data

**Service:** `src/features/movies/services/movie.service.ts`

```tsx
export async function getMovieDetail(id: string) {
  'use cache';
  cacheLife('days');
  return tmdbFetch(`/movie/${id}`, MovieDetailSchema);
}
```

**TMDB wrapper:** `src/lib/tmdb.ts`

```tsx
export async function tmdbFetch<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${process.env.TMDB_BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
  return schema.parse(await res.json());  // runtime validation with Zod
}
```

**Parallel data fetching:** `src/app/movie/[id]/page.tsx`

```tsx
const [movie, credits, similar] = await Promise.all([
  getMovieDetail(id),
  getMovieCredits(id),
  getSimilar(id, 'movie'),
]);
```

**Database queries:** `src/features/watchlist/queries/watchlist.queries.ts`

```tsx
export async function getWatchlistByUser(userId: string) {
  return db.query.watchlistEntries.findMany({
    where: eq(watchlistEntries.userId, userId),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}
```

**Key takeaway:** Fetch data where you render it. Use `Promise.all()` for parallel requests. Validate API responses at the boundary with Zod. Access databases directly in Server Components — no REST API needed.

---

## 14. Caching (`use cache`)

Next.js 16 introduces the `'use cache'` directive and `cacheLife`/`cacheTag` functions for fine-grained cache control.

**File:** `src/features/movies/services/movie.service.ts`

```tsx
export async function getTrending(type, window, page) {
  'use cache';              // ← opt into caching
  cacheLife('hours');       // ← cache for 1 hour
  cacheTag('trending');     // ← tag for targeted invalidation
  return tmdbFetch(`/trending/${type}/${window}?page=${page}`, ...);
}

export async function getMovieDetail(id: string) {
  'use cache';
  cacheLife('days');        // ← cache for 1 day (content rarely changes)
  cacheTag(`movie-${id}`); // ← per-item tag
  return tmdbFetch(`/movie/${id}`, MovieDetailSchema);
}
```

**Configuration:** `next.config.ts`

```tsx
const nextConfig: NextConfig = {
  cacheComponents: true,    // ← enable Next.js 16 explicit caching model
};
```

**Key takeaway:** `'use cache'` replaces the older `revalidate` option. Use `cacheLife` for TTL duration and `cacheTag` for on-demand invalidation with `revalidateTag()`.

---

## 15. Suspense Boundaries

`<Suspense>` lets you show fallback UI while async children load. This enables streaming — fast initial shell with progressive content.

**Files:**
- `src/app/page.tsx` — wraps `TrendingResults` with Suspense
- `src/app/search/page.tsx` — wraps `SearchResults` with Suspense
- `src/app/layout.tsx` — wraps `Navbar` (async server component) with Suspense
- `src/app/movie/[id]/page.tsx` — wraps `WatchlistButton` (async server component) with Suspense

```tsx
// Unique key forces re-render when params change
<Suspense key={`${type}-${page}`} fallback={<MovieGridSkeleton />}>
  <TrendingResults type={type} page={page} />
</Suspense>
```

```tsx
// Nested Suspense — page loads first, watchlist button streams in later
<MovieDetail movie={movie} credits={credits} />
<Suspense>
  <MovieWatchlistButton movieId={movie.id} ... />
</Suspense>
```

**Key takeaway:** Use Suspense with a unique `key` prop when wrapping content that depends on URL params — this forces a fresh fallback on param change. Nest Suspense boundaries to stream content progressively: important content first, secondary content as it loads.

---

## 16. searchParams & URL State

Pages can read query parameters via the `searchParams` prop (a `Promise` in Next.js 15+).

**Files:**
- `src/app/page.tsx` — reads `?type=movie&page=1`
- `src/app/search/page.tsx` — reads `?q=batman&page=1`
- `src/app/watchlist/page.tsx` — reads `?status=watched`

```tsx
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === 'tv' ? 'tv' : 'movie';
  const page = Math.max(1, Number(params.page) || 1);
  // ...
}
```

**Client-side URL manipulation:** `src/features/search/hooks/useSearch.ts`

```tsx
'use client';
export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const setQuery = useCallback((value: string) => {
    // 300ms debounce, then push URL
    timerRef.current = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }, 300);
  }, [router]);

  return { query, setQuery };
}
```

**Key takeaway:** Use URL state for filterable/shareable UI (tabs, pagination, search). Server Components read `searchParams`; Client Components use `useSearchParams()` + `router.push()`.

---

## 17. generateStaticParams (Static Generation)

Pre-renders dynamic routes at build time. Equivalent to `getStaticPaths` from Pages Router.

**File:** `src/app/movie/[id]/page.tsx`

```tsx
export async function generateStaticParams() {
  const trending = await getTrending('movie', 'week');
  return trending.results.slice(0, 20).map((m) => ({ id: String(m.id) }));
}
```

**Key takeaway:** Returns an array of `params` objects. The top 20 trending movies are pre-rendered at build time. Other IDs are rendered on-demand and cached (ISR behavior).

---

## 18. generateMetadata (Dynamic SEO)

Generates per-page metadata (title, description, OpenGraph) based on fetched data.

**File:** `src/app/movie/[id]/page.tsx`

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetail(id);
  return {
    title: `${movie.title} — Movie Tracker`,
    description: movie.overview,
    openGraph: movie.backdrop_path
      ? { images: [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`] }
      : undefined,
  };
}
```

**Static metadata:** `src/app/watchlist/page.tsx`

```tsx
export const metadata: Metadata = {
  title: 'My Watchlist — Movie Tracker',
};
```

**Key takeaway:** Use `generateMetadata` for dynamic titles/descriptions. Use the static `metadata` export for fixed pages. Next.js deduplicates `fetch` calls — `generateMetadata` and the page component can call the same service without double-fetching.

---

## 19. Middleware

Runs before every matched request. Used here for auth protection.

**File:** `proxy.ts` (project root, could also be `middleware.ts`)

```tsx
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith('/watchlist');

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/watchlist/:path*'],   // ← only runs on these routes
};
```

**Key takeaway:** The `matcher` config restricts which routes trigger the middleware (avoids running on static assets). Here, Auth.js provides a wrapper around middleware that injects `req.auth`.

---

## 20. Authentication (Auth.js v5)

**Files:**
- `src/lib/auth.ts` — NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` — auth API routes
- `proxy.ts` — middleware-based route protection

```tsx
// src/lib/auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: { signIn: '/login' },
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;  // expose user ID
      return session;
    },
  },
});
```

```tsx
// Auth API route — re-exports handlers
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
```

**Session usage in Server Components:**

```tsx
// src/components/Navbar.tsx
const session = await auth();
if (session?.user) { /* show watchlist link */ }
```

**Protected page pattern:**

```tsx
// src/app/watchlist/page.tsx
const session = await auth();
if (!session?.user?.id) redirect('/login');
```

**Key takeaway:** Auth.js v5 exports `auth()` for server-side session access, `signIn()`/`signOut()` for auth actions, and `handlers` for API routes. Use `auth()` both in Server Components and middleware.

---

## 21. Database (Drizzle ORM + Neon)

**Files:**
- `src/db/schema.ts` — table definitions with PostgreSQL enums
- `src/db/index.ts` — Drizzle client initialization
- `src/features/watchlist/queries/watchlist.queries.ts` — read queries
- `src/features/watchlist/actions/watchlist.actions.ts` — write mutations
- `drizzle.config.ts` — migration configuration

```tsx
// src/db/schema.ts — schema definition
export const watchlistStatusEnum = pgEnum('watchlist_status', [
  'want_to_watch', 'watching', 'watched',
]);

export const watchlistEntries = pgTable('watchlist_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  mediaId: integer('media_id').notNull(),
  status: watchlistStatusEnum('status').notNull(),
  rating: integer('rating'),
  // ...
});

// TypeScript types inferred from schema
export type WatchlistEntry = typeof watchlistEntries.$inferSelect;
```

```tsx
// src/db/index.ts — client (Neon serverless HTTP driver)
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql, { schema });
```

**Key takeaway:** Drizzle provides type-safe queries inferred from the schema. The Neon HTTP driver is ideal for serverless environments (no persistent connections). Queries and mutations are separated into dedicated files.

---

## 22. Image Optimization

Next.js `<Image>` component handles lazy loading, responsive sizing, and format optimization.

**Config:** `next.config.ts`

```tsx
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'image.tmdb.org',
    pathname: '/t/p/**',
  }],
},
```

**Usage:** `src/features/movies/components/MovieCard.tsx`

```tsx
<Image
  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
  alt={title}
  fill                  // ← fills parent container
  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
  className="object-cover transition-transform group-hover:scale-105"
/>
```

**Key takeaway:** Whitelist remote image domains in `next.config.ts`. Use `sizes` for responsive images to avoid loading desktop-sized images on mobile. Use `fill` with a sized parent container for dynamic aspect ratios.

---

## 23. Font Optimization

Next.js `next/font` automatically self-hosts Google Fonts with zero layout shift.

**File:** `src/app/layout.tsx`

```tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// Applied as CSS variables on <body>
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
```

**Key takeaway:** Fonts are downloaded at build time and self-hosted — no external requests. CSS variables allow Tailwind to reference them throughout the app.

---

## 24. Revalidation (On-Demand)

After mutations, `revalidatePath()` invalidates the cache for a specific route so the next visit gets fresh data.

**File:** `src/features/watchlist/actions/watchlist.actions.ts`

```tsx
export async function addToWatchlist(input) {
  // ... check for duplicates, insert into database
  revalidatePath('/watchlist');   // ← purge cached watchlist page
}

export async function removeFromWatchlist(entryId: string) {
  // ... delete from database
  revalidatePath('/watchlist');
}
```

**Caveat with intercepting routes:** `revalidatePath()` triggers a router refresh that destroys intercepted route state. If a Server Action is called from inside a modal (intercepting route), the modal will close and the full page will render. For this reason, this project keeps mutations on the full detail page only — the modal serves as a read-only preview.

**Key takeaway:** Call `revalidatePath()` in Server Actions after data mutations. The next request to that path will render fresh content. You can also use `revalidateTag()` to invalidate by cache tag. Be aware that `revalidatePath` can conflict with intercepting routes — avoid calling it from inside modals.

---

## 25. React 19 Patterns

This project uses React 19 features extensively.

### useOptimistic

Updates UI instantly before the server confirms the mutation.

**File:** `src/features/watchlist/components/WatchlistButton.tsx`

```tsx
const [optimisticEntry, setOptimisticEntry] = useOptimistic(initialEntry);

const handleAdd = () => {
  startTransition(async () => {
    setOptimisticEntry({ id: 'temp', status: 'want_to_watch', ... }); // instant
    await addToWatchlist({ ... });  // server call
  });
};
```

### useTransition

Tracks pending state for async operations without blocking the UI.

```tsx
const [isPending, startTransition] = useTransition();

// Use isPending to show loading indicators
<Button disabled={isPending}>
  {isPending ? 'Adding...' : 'Add to Watchlist'}
</Button>
```

### Form actions with `action` prop

```tsx
// src/components/Navbar.tsx — form with Server Action
<form action={async () => {
  'use server';
  await signIn('github');
}}>
  <Button>Sign In</Button>
</form>
```

---

## 26. Form Handling (React Hook Form + Zod)

**File:** `src/features/watchlist/components/RatingForm.tsx`

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const ratingFormSchema = z.object({
  status: z.enum(['want_to_watch', 'watching', 'watched']),
  rating: z.number().min(1).max(5).nullable(),
  note: z.string().max(500).nullable(),
});

const { control, handleSubmit, reset } = useForm<RatingFormValues>({
  resolver: zodResolver(ratingFormSchema),
  defaultValues: initialValues,
});

const onSubmit = (values: RatingFormValues) => {
  startTransition(async () => {
    await updateWatchlistEntry(entryId, values);  // Server Action
  });
};
```

**Key takeaway:** Zod schemas are shared between client validation (React Hook Form) and server validation (Server Actions) for consistent rules. The `Controller` component bridges React Hook Form with uncontrolled shadcn/ui components.

---

## 27. Path Aliases

**Config:** `tsconfig.json`

```json
{ "paths": { "@/*": ["./src/*"] } }
```

**Usage in imports:**

```tsx
import { auth } from '@/lib/auth';
import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { Button } from '@/components/ui/button';
```

**Key takeaway:** `@/` maps to `src/` — clean imports without relative path chains like `../../../`.

---

## 28. React Compiler

Automatically memoizes components and hooks — no manual `useMemo`/`useCallback`/`React.memo` needed in most cases.

**Config:** `next.config.ts`

```tsx
const nextConfig: NextConfig = {
  reactCompiler: true,   // ← stable in Next.js 16
};
```

**Note:** `MovieCard.tsx` still uses `memo()` explicitly — this works alongside the compiler but is largely redundant when the compiler is enabled.

---

## 29. Environment Variables

**File:** `.env` (not committed)

| Variable             | Used In                        | Purpose                        |
|----------------------|--------------------------------|--------------------------------|
| `TMDB_API_KEY`       | `src/lib/tmdb.ts`              | TMDB API bearer token          |
| `TMDB_BASE_URL`      | `src/lib/tmdb.ts`              | TMDB API base URL              |
| `AUTH_SECRET`         | Auth.js (automatic)            | Session encryption key         |
| `AUTH_GITHUB_ID`      | Auth.js (automatic)            | GitHub OAuth client ID         |
| `AUTH_GITHUB_SECRET`  | Auth.js (automatic)            | GitHub OAuth client secret     |
| `POSTGRES_URL`        | `src/db/index.ts`              | Neon PostgreSQL connection     |

**Key takeaway:** Server-side env vars (no `NEXT_PUBLIC_` prefix) are only available in Server Components, Server Actions, and Route Handlers — never exposed to the browser.

---

## 30. Catch-All Routes

The `[...param]` syntax matches any number of segments.

**File:** `src/app/api/auth/[...nextauth]/route.ts`

```tsx
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
```

This single file handles all auth routes: `/api/auth/signin`, `/api/auth/callback/github`, `/api/auth/signout`, etc.

**Key takeaway:** `[...nextauth]` catches `/api/auth/*` at any depth, passing all segments as an array to the handler.

---

## 31. Feature-Based Project Structure

The project organizes code by feature domain rather than by technical layer.

```
src/
├── app/                    # Routes only — thin pages calling feature code
├── components/             # Shared UI components (Navbar, shadcn/ui)
├── db/                     # Database setup (schema, client, migrations)
├── lib/                    # Shared utilities (auth, api helpers, tmdb client)
└── features/
    ├── movies/
    │   ├── services/       # Data fetching (TMDB API calls)
    │   ├── types/          # Zod schemas + TypeScript types
    │   └── components/     # Movie-specific UI (cards, grids, detail views)
    ├── search/
    │   ├── components/     # SearchBar
    │   └── hooks/          # useSearch
    └── watchlist/
        ├── types/          # Watchlist types
        ├── constants/      # Status label mappings
        ├── queries/        # Database read queries
        ├── actions/        # Server Actions (mutations)
        └── components/     # WatchlistButton, RatingForm, WatchlistGrid
```

**Key takeaway:** Each feature is self-contained with its own types, data layer, and components. App routes are thin orchestrators that import from features. This scales better than grouping all components, all services, etc. into flat folders.

---

## 32. Link Component & Client-Side Navigation

The `Link` component from `next/link` enables client-side navigation — clicking a link swaps the page content without a full browser reload. Next.js automatically **prefetches** linked routes in the viewport.

**Files:**
- `src/features/movies/components/MovieCard.tsx` — card links to movie/TV detail
- `src/app/page.tsx` — tab links and pagination links
- `src/app/search/page.tsx` — pagination links
- `src/app/watchlist/page.tsx` — filter tab links
- `src/components/Navbar.tsx` — logo and watchlist nav links
- `src/app/not-found.tsx` — "Go home" link

```tsx
// src/features/movies/components/MovieCard.tsx
import Link from 'next/link';

const href = `/${item.media_type}/${item.id}`;

<Link href={href} className="group flex flex-col gap-2">
  {/* card content */}
</Link>
```

**Link with `asChild` pattern (via shadcn Button):**

```tsx
// src/app/page.tsx — button that navigates like a link
<Button variant="outline" size="sm" asChild>
  <Link href={`/?type=${type}&page=${page + 1}`}>
    Next
    <ChevronRightIcon className="size-4" />
  </Link>
</Button>
```

**Navbar navigation:**

```tsx
// src/components/Navbar.tsx
<Link href="/" className="flex shrink-0 items-center gap-1.5 font-semibold">
  <FilmIcon className="size-5" />
  <span className="hidden sm:inline">Movie Tracker</span>
</Link>

<Link href="/watchlist" className="flex items-center gap-1.5 text-sm ...">
  <ListIcon className="size-4" />
  <span className="hidden sm:inline">Watchlist</span>
</Link>
```

**Key takeaway:** Always use `Link` instead of `<a>` for internal navigation. Next.js prefetches linked routes when they enter the viewport, making subsequent navigations near-instant. Combine with `Button asChild` to get button styling with link behavior.

---

## 33. Partial Prerendering (PPR)

Partial Prerendering combines static and dynamic rendering in a single page. The static shell is served instantly from the CDN, while dynamic parts stream in via Suspense boundaries.

**Evidence in build output:**

```
Route (app)                  Revalidate  Expire
┌ ◐ /                                           ← ◐ = Partial Prerender
├ ◐ /movie/[id]                      1d      1w
├ ◐ /search
├ ◐ /tv/[id]                         1d      1w
└ ◐ /watchlist

◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

**How it works in this project:**

The home page (`src/app/page.tsx`) demonstrates PPR naturally:

```tsx
// Static shell: heading, tab navigation, page structure
// ↓ rendered instantly as static HTML

<main className="mx-auto max-w-6xl px-4 py-8">
  <h1>Trending</h1>
  <nav>{/* tab links */}</nav>

  {/* Dynamic part: streams in after data fetches */}
  <Suspense key={`${type}-${page}`} fallback={<MovieGridSkeleton />}>
    <TrendingResults type={type} page={page} />
  </Suspense>
</main>
```

The movie detail page (`src/app/movie/[id]/page.tsx`) shows nested PPR:

```tsx
// Static: page structure pre-rendered via generateStaticParams
// Dynamic 1: movie detail (cached, streams quickly)
// Dynamic 2: watchlist button (requires auth, streams separately)

<MovieDetail movie={movie} credits={credits} />
<Suspense>
  <MovieWatchlistButton movieId={movie.id} ... />
</Suspense>
```

**Configuration:** `next.config.ts`

```tsx
const nextConfig: NextConfig = {
  cacheComponents: true,    // ← enables the explicit caching model PPR relies on
};
```

**Key takeaway:** PPR is automatic when you use Suspense boundaries in Server Components. The static HTML shell loads instantly, then dynamic content streams in. No configuration needed beyond `cacheComponents: true` — just structure your components with Suspense around dynamic parts.

---

## 34. Server-Side Redirects (`redirect` & `notFound`)

Next.js provides `redirect()` and `notFound()` functions for server-side navigation control. They throw special errors that Next.js intercepts — they must be called **outside** of try/catch blocks.

**`redirect()` — used for auth protection:**

```tsx
// src/app/watchlist/page.tsx
import { redirect } from 'next/navigation';

export default async function WatchlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');  // ← stops rendering, sends 307
  // ... rest of page only runs if authenticated
}
```

```tsx
// src/features/watchlist/actions/watchlist.actions.ts
async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');  // ← redirect from Server Action
  return session.user.id;
}
```

**Where `notFound()` could be used:**

```tsx
// Calling notFound() triggers the closest not-found.tsx boundary
import { notFound } from 'next/navigation';

const movie = await getMovieDetail(id);
if (!movie) notFound();  // ← renders src/app/not-found.tsx
```

**Files:**
- `src/app/watchlist/page.tsx` — `redirect('/login')` when not authenticated
- `src/features/watchlist/actions/watchlist.actions.ts` — `redirect('/login')` in `requireAuth()`
- `src/app/not-found.tsx` — the page rendered when `notFound()` is called

**Key takeaway:** Use `redirect()` for auth guards and post-mutation redirects. Use `notFound()` when data doesn't exist. Both work in Server Components, Server Actions, and Route Handlers. Never wrap them in try/catch — they use thrown errors as a control flow mechanism.

---

## 35. Server/Client Composition Pattern

A key architectural pattern: **async Server Components fetch data, then pass it as props to Client Components** that handle interactivity. This keeps the client bundle small while enabling rich interactions.

**Primary example:** `src/app/movie/[id]/page.tsx` + `src/features/watchlist/components/WatchlistButton.tsx`

```tsx
// SERVER: async wrapper fetches auth + database data
// src/app/movie/[id]/page.tsx
async function MovieWatchlistButton({ movieId, title, posterPath }: { ... }) {
  const session = await auth();                              // server-only
  const entry = session?.user?.id
    ? await getWatchlistEntry(session.user.id, movieId)      // database query
    : null;

  return (
    <WatchlistButton                    // ← Client Component
      mediaId={movieId}
      mediaType="movie"
      title={title}
      posterPath={posterPath}
      initialEntry={entry ?? null}      // ← server data passed as prop
    />
  );
}

// Used in the page with Suspense (streams independently)
<Suspense>
  <MovieWatchlistButton movieId={movie.id} title={movie.title} ... />
</Suspense>
```

```tsx
// CLIENT: receives server data, adds interactivity
// src/features/watchlist/components/WatchlistButton.tsx
'use client';

export function WatchlistButton({ initialEntry, ... }: Props) {
  const [optimisticEntry, setOptimisticEntry] = useOptimistic(initialEntry);
  // useOptimistic, useTransition, onClick handlers...
}
```

**Another example:** `src/components/Navbar.tsx` (Server) + `src/features/search/components/SearchBar.tsx` (Client)

```tsx
// SERVER: Navbar reads auth session, renders conditionally
export async function Navbar() {
  const session = await auth();
  return (
    <header>
      <Suspense>
        <SearchBar />          {/* ← Client Component, no server data needed */}
      </Suspense>
      {session?.user && <Link href="/watchlist">Watchlist</Link>}
    </header>
  );
}
```

**The pattern:**

```
Server Component (async, has access to auth/db/secrets)
  └─ fetches data
  └─ passes data as props to ──→ Client Component ('use client')
                                    └─ hooks (useState, useOptimistic)
                                    └─ event handlers (onClick, onSubmit)
                                    └─ calls Server Actions for mutations
```

**Key takeaway:** Push the `'use client'` boundary as deep as possible. Server Components handle data fetching (auth, database, APIs) and pass serializable props down. Client Components handle interactivity only. Wrap async Server Components in `<Suspense>` so they can stream independently without blocking the page.

---

## 36. Route Groups

Folders wrapped in parentheses `(groupName)` organize routes **without affecting the URL**. They're used to apply shared layouts, group related pages logically, or separate public/authenticated areas.

**File:** `src/app/(auth)/login/page.tsx` — accessible at `/login` (not `/(auth)/login`)

```tsx
// src/app/(auth)/login/page.tsx
import { redirect } from 'next/navigation';
import { auth, signIn } from '@/lib/auth';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');    // ← already logged in, go home

  return (
    <main>
      <h1>Sign in to Movie Tracker</h1>
      <form action={async () => {
        'use server';
        await signIn('github', { redirectTo: '/' });
      }}>
        <Button>Continue with GitHub</Button>
      </form>
    </main>
  );
}
```

**Folder structure:**

```
src/app/
├── (auth)/           # ← route group — no effect on URL
│   └── login/
│       └── page.tsx  # ← renders at /login
├── watchlist/
│   └── page.tsx      # ← renders at /watchlist
└── layout.tsx        # ← shared root layout
```

**Common use cases:**
- `(auth)` — sign in, sign up, forgot password (could share a minimal layout without Navbar)
- `(dashboard)` — authenticated pages with sidebar navigation
- `(marketing)` — landing pages with a different layout

**Key takeaway:** Route groups exist purely for organization. They can optionally have their own `layout.tsx` to apply a different layout to a subset of routes. The parentheses tell Next.js "this folder is structural, not a URL segment."

---

## 37. Sitemap & Robots

Next.js can generate `sitemap.xml` and `robots.txt` from TypeScript files, including dynamic content from APIs or databases.

**File:** `src/app/sitemap.ts` — generates `/sitemap.xml`

```tsx
import type { MetadataRoute } from 'next';
import { getTrending } from '@/features/movies/services/movie.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trendingMovies, trendingTv] = await Promise.all([
    getTrending('movie', 'week'),
    getTrending('tv', 'week'),
  ]);

  const movieEntries = trendingMovies.results.map((movie) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${movie.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const tvEntries = trendingTv.results.map((show) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/tv/${show.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}`, priority: 1 },
    { url: `${process.env.NEXT_PUBLIC_BASE_URL}/search`, priority: 0.5 },
    ...movieEntries,
    ...tvEntries,
  ];
}
```

**File:** `src/app/robots.ts` — generates `/robots.txt`

```tsx
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/watchlist'],   // ← hide private/API routes
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
```

**Build output confirms generation:**

```
├ ○ /robots.txt          ← static
├ ƒ /sitemap.xml         ← dynamic (fetches trending data)
```

**Key takeaway:** Use `sitemap.ts` for dynamic content that changes (fetched from APIs/DB) and `robots.ts` for crawl rules. Both use the `MetadataRoute` type for full type safety. The sitemap function can be `async` to fetch data at generation time.

---

## 38. Dynamic Imports (`next/dynamic`)

`next/dynamic` lazy-loads components — they're only downloaded when needed, reducing the initial JavaScript bundle size.

**File:** `src/features/watchlist/components/WatchlistGrid.tsx`

```tsx
'use client';

import dynamic from 'next/dynamic';

// Lazy-load RatingForm — heavy component (React Hook Form + Zod + Dialog)
// Only loaded when user interacts with the Edit button
const RatingForm = dynamic(() =>
  import('./RatingForm').then((mod) => ({ default: mod.RatingForm })),
);
```

**Why `RatingForm` is a good candidate for lazy loading:**
- It pulls in React Hook Form, Zod resolver, Dialog, Select, Textarea, and StarRating
- Most users browse without editing — no need to load this upfront
- The form only renders when the user clicks "Edit" (inside a Dialog)

**Named export handling:**

```tsx
// RatingForm uses a named export, not default export.
// dynamic() expects a default export, so we remap it:
dynamic(() =>
  import('./RatingForm').then((mod) => ({ default: mod.RatingForm })),
);
```

**Key takeaway:** Use `dynamic()` for heavy client components that aren't needed on initial render (modals, forms, charts, rich text editors). It's especially effective when the component is behind a user interaction like a button click. For components with named exports, remap to `default` in the `.then()` callback.

---

## 39. Instrumentation

The `instrumentation.ts` file runs code when the Next.js server starts. It's the place for monitoring setup, OpenTelemetry initialization, or runtime-specific bootstrapping.

**File:** `instrumentation.ts` (project root)

```tsx
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[instrumentation] Node.js runtime initialized');
    // Initialize: OpenTelemetry, Sentry, DataDog, logging libraries
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('[instrumentation] Edge runtime initialized');
    // Edge-specific initialization
  }
}

export async function onRequestError(
  error: { digest: string },
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string },
) {
  console.error('[instrumentation] Request error:', {
    digest: error.digest,
    path: request.path,
    routePath: context.routePath,
    routeType: context.routeType,
  });
  // Report to error tracking service (Sentry, etc.)
}
```

**Two exported functions:**
- **`register()`** — runs once when the server starts. Use `NEXT_RUNTIME` to branch between Node.js and Edge runtime initialization.
- **`onRequestError()`** — called on every unhandled request error. Provides structured error context (route path, type, digest) for error reporting services.

**Key takeaway:** Place `instrumentation.ts` at the project root (not in `src/`). It runs before any request is handled — ideal for initializing monitoring SDKs. The `NEXT_RUNTIME` check lets you load runtime-specific packages (e.g., Node.js-only APM tools won't work on Edge).

---

## Summary

| # | Topic | Complexity | Key File(s) |
|---|-------|------------|-------------|
| 1 | App Router | Foundational | `src/app/*/page.tsx` |
| 2 | Layouts | Foundational | `src/app/layout.tsx` |
| 3 | Server Components | Foundational | `src/app/page.tsx`, `Navbar.tsx` |
| 4 | Client Components | Foundational | `WatchlistButton.tsx`, `SearchBar.tsx` |
| 5 | Dynamic Routes | Foundational | `src/app/movie/[id]/page.tsx` |
| 6 | Parallel Routes | Advanced | `src/app/@modal/` |
| 7 | Intercepting Routes | Advanced | `src/app/@modal/(.)movie/[id]/` |
| 8 | Loading States | Intermediate | `src/app/*/loading.tsx` |
| 9 | Error Boundaries | Intermediate | `src/app/*/error.tsx` |
| 10 | Custom 404 | Foundational | `src/app/not-found.tsx` |
| 11 | Server Actions | Intermediate | `watchlist.actions.ts` |
| 12 | API Route Handlers | Intermediate | `src/app/api/movies/*/route.ts` |
| 13 | Data Fetching | Intermediate | `movie.service.ts`, `tmdb.ts` |
| 14 | Caching (`use cache`) | Advanced | `movie.service.ts` |
| 15 | Suspense Boundaries | Intermediate | `src/app/page.tsx` |
| 16 | searchParams | Intermediate | `src/app/page.tsx`, `useSearch.ts` |
| 17 | generateStaticParams | Advanced | `src/app/movie/[id]/page.tsx` |
| 18 | generateMetadata | Intermediate | `src/app/movie/[id]/page.tsx` |
| 19 | Middleware | Intermediate | `proxy.ts` |
| 20 | Authentication | Intermediate | `src/lib/auth.ts` |
| 21 | Database (Drizzle) | Intermediate | `src/db/schema.ts`, `src/db/index.ts` |
| 22 | Image Optimization | Foundational | `MovieCard.tsx`, `next.config.ts` |
| 23 | Font Optimization | Foundational | `src/app/layout.tsx` |
| 24 | Revalidation | Intermediate | `watchlist.actions.ts` |
| 25 | React 19 Patterns | Advanced | `WatchlistButton.tsx` |
| 26 | Form Handling | Intermediate | `RatingForm.tsx` |
| 27 | Path Aliases | Foundational | `tsconfig.json` |
| 28 | React Compiler | Advanced | `next.config.ts` |
| 29 | Environment Variables | Foundational | `.env`, `tmdb.ts` |
| 30 | Catch-All Routes | Foundational | `api/auth/[...nextauth]/route.ts` |
| 31 | Project Structure | Architectural | `src/features/` |
| 32 | Link & Navigation | Foundational | `MovieCard.tsx`, `Navbar.tsx` |
| 33 | Partial Prerendering | Advanced | `src/app/page.tsx`, `next.config.ts` |
| 34 | redirect & notFound | Intermediate | `watchlist/page.tsx`, `watchlist.actions.ts` |
| 35 | Server/Client Composition | Architectural | `movie/[id]/page.tsx`, `WatchlistButton.tsx` |
| 36 | Route Groups | Intermediate | `src/app/(auth)/login/page.tsx` |
| 37 | Sitemap & Robots | Intermediate | `src/app/sitemap.ts`, `src/app/robots.ts` |
| 38 | Dynamic Imports | Intermediate | `WatchlistGrid.tsx` |
| 39 | Instrumentation | Advanced | `instrumentation.ts` |
