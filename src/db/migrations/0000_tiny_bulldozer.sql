CREATE TYPE "public"."watchlist_media_type" AS ENUM('movie', 'tv');--> statement-breakpoint
CREATE TYPE "public"."watchlist_status" AS ENUM('want_to_watch', 'watching', 'watched');--> statement-breakpoint
CREATE TABLE "watchlist_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "watchlist_media_type" NOT NULL,
	"title" text NOT NULL,
	"poster_path" text,
	"status" "watchlist_status" NOT NULL,
	"rating" integer,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
