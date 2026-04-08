# Supabase Projects

## Dev — `debugdle-dev`
- **Project ID:** `sbuckaoapwbyyglogibp`
- **URL:** `https://sbuckaoapwbyyglogibp.supabase.co`
- Used in `.env.local` during development.

## Prod — `k4ysam's Project`
- **Project ID:** `kvdcyvkcxkzeoiellxmo`
- **URL:** `https://kvdcyvkcxkzeoiellxmo.supabase.co`
- Set these in your deployment platform (Vercel → Settings → Environment Variables), scoped to **Production** only.
- **Never** commit prod keys to the repo.

## Switching environments

| Context | Env file | Points to |
|---------|----------|-----------|
| Local dev (`npm run dev`) | `.env.local` | debugdle-dev |
| Vercel preview deploys | Vercel env vars (Preview) | debugdle-dev (optional) |
| Vercel production deploy | Vercel env vars (Production) | k4ysam's Project |

## Keeping schemas in sync

When you run a migration locally (via Supabase MCP or CLI), apply it to both projects:
1. Dev: applied automatically during development
2. Prod: apply via MCP or `supabase db push --linked` before deploying to main

## Prod anon key
Store this in Vercel → Environment Variables → Production:
```
NEXT_PUBLIC_SUPABASE_URL=https://kvdcyvkcxkzeoiellxmo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2ZGN5dmtjeGt6ZW9pZWxseG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODQ3MTksImV4cCI6MjA5MTE2MDcxOX0.4RstVZ8x9MaEZYyp2hSou0crNrA5LSE2YfASq7s8nmo
```
