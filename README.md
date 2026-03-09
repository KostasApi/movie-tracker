# Movie Tracker

A full-stack movie and TV show tracking application built with Next.js 16. Browse trending content, search the TMDB catalog, and manage a personal watchlist with ratings and notes.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, React Compiler)
- **Styling**: Tailwind CSS 4, shadcn/ui (Radix Nova)
- **Database**: Drizzle ORM + Neon PostgreSQL
- **Auth**: Auth.js v5 (NextAuth) with GitHub OAuth
- **API**: TMDB (The Movie Database)
- **Forms**: React Hook Form + Zod v4
- **Icons**: Lucide React

## Features

- **Trending** — Browse trending movies and TV shows with pagination
- **Search** — Debounced search across movies and TV shows
- **Detail Pages** — Movie/TV detail with backdrop, cast, genres, and similar titles
- **Intercepting Modals** — Quick-preview detail pages via modal overlays
- **Watchlist** — Add, rate (1-5 stars), annotate, and filter entries by status
- **Optimistic UI** — Instant feedback on watchlist add/remove/update actions
- **Auth** — GitHub OAuth sign-in with protected watchlist routes
- **REST API** — Public endpoints for trending and search (proxies TMDB)

## Getting Started

### Prerequisites

- Node.js 20+
- A [TMDB account](https://www.themoviedb.org/settings/api) (for the API Read Access Token)
- A [Neon](https://neon.tech) PostgreSQL database
- A [GitHub OAuth app](https://github.com/settings/developers) (for authentication)

### Setup

```bash
# Clone and install
git clone https://github.com/KostasApi/movie-tracker
cd movie-tracker
npm install

# Configure environment
cp .env.example .env
# Fill in the values in .env (see below)

# Run database migrations
npx drizzle-kit migrate

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for all required variables:

| Variable             | Description                                      |
| -------------------- | ------------------------------------------------ |
| `TMDB_API_KEY`       | TMDB v4 Read Access Token (starts with `eyJ...`) |
| `TMDB_BASE_URL`      | `https://api.themoviedb.org/3`                   |
| `AUTH_SECRET`        | Auth.js secret — generate with `npx auth secret` |
| `AUTH_GITHUB_ID`     | GitHub OAuth App Client ID                       |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret                   |
| `POSTGRES_DATABASE`  | Neon PostgreSQL connection string                |

## Project Structure

```
src/
├── app/                          # App Router pages and API routes
│   ├── page.tsx                  # Home — trending movies/TV
│   ├── search/                   # Search results
│   ├── movie/[id]/               # Movie detail
│   ├── tv/[id]/                  # TV show detail
│   ├── watchlist/                # User watchlist (auth-protected)
│   ├── @modal/                   # Intercepting route modals
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Auth.js handler
│   │   └── movies/               # Public REST API (trending, search)
│   ├── error.tsx                 # Global error boundary
│   └── not-found.tsx             # Custom 404
├── components/                   # Shared UI (Navbar, StarRating, shadcn)
├── features/
│   ├── movies/                   # TMDB types, services, components
│   ├── watchlist/                # Actions, queries, types, components
│   └── search/                   # SearchBar, useSearch hook
├── db/                           # Drizzle schema and migrations
└── lib/                          # Auth config, TMDB client, utilities
```

## API Endpoints

### `GET /api/movies/trending`

Returns trending movies or TV shows from TMDB.

| Param    | Default | Values        |
| -------- | ------- | ------------- |
| `type`   | `movie` | `movie`, `tv` |
| `window` | `week`  | `day`, `week` |

### `GET /api/movies/search`

Searches movies and TV shows on TMDB.

| Param  | Required | Description                     |
| ------ | -------- | ------------------------------- |
| `q`    | Yes      | Search query (min 2 characters) |
| `page` | No       | Page number (default: 1)        |

## Scripts

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm run dev`         | Start development server         |
| `npm run build`       | Production build                 |
| `npm run start`       | Start production server          |
| `npm run lint`        | Run ESLint                       |
| `npm run db:generate` | Generate Drizzle migrations      |
| `npm run db:migrate`  | Run database migrations          |
| `npm run db:studio`   | Open Drizzle Studio (DB browser) |
