-- First-party traffic analytics: one row per page view, signed-in or not.
--
-- WHY THIS EXISTS: Vercel Web Analytics only reports aggregates inside Vercel's
-- own dashboard. This table puts the same signal in our database so /admin can
-- answer "how many people came today, and where from?" next to the signed-in
-- user metrics it already shows.
--
-- PRIVACY: no raw IP is ever stored. `visitor_id` is
--     sha256(ip + user-agent + secret salt + UTC date)
-- truncated to 32 hex chars. It rotates every midnight UTC, so it can count
-- unique visitors within a day but cannot follow anyone across days and cannot
-- be reversed back to an IP. No cookie is set for it.
--
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.page_views (
  id            bigserial primary key,
  visitor_id    text        not null,   -- daily-rotating hash, NOT an identity
  path          text        not null,   -- e.g. "/topics/sorting/bubble-sort"
  source        text        not null,   -- "google" | "dev.to" | "direct" | ...
  medium        text        not null,   -- "organic" | "referral" | "direct" | utm_medium
  campaign      text,                   -- utm_campaign, when present
  country       text,                   -- 2-letter code from the edge, or null
  device        text        not null,   -- "mobile" | "tablet" | "desktop"
  browser       text        not null,
  is_signed_in  boolean     not null default false,
  viewed_at     timestamptz not null default now()
);

-- Every admin query is "recent rows, newest first" or "rows since <date>".
create index if not exists page_views_viewed_at_idx
  on public.page_views (viewed_at desc);

-- Counting distinct visitors per day.
create index if not exists page_views_day_visitor_idx
  on public.page_views (viewed_at, visitor_id);

-- Writes come from the server route using the SECRET key, which bypasses RLS.
-- RLS is on with NO policies and NO grants to `anon`/`authenticated`, so the
-- browser can neither read nor write this table directly — the only way in is
-- through /api/track, and the only way out is the admin dashboard.
alter table public.page_views enable row level security;

revoke all on public.page_views from anon, authenticated;

-- ...but `service_role` DOES need table privileges. Same lesson as 0004: RLS
-- bypass is not a GRANT. Without this, every insert from /api/track fails with
-- 42501 "permission denied" — and because the route swallows errors on purpose,
-- it fails *silently* and the dashboard just shows zero traffic forever.
grant select, insert, delete on public.page_views to service_role;
grant usage, select on sequence public.page_views_id_seq to service_role;

-- Retention: keep 180 days. Run periodically (Supabase → Database → Cron), or
-- by hand now and then — the dashboard never looks further back than 30 days.
--   delete from public.page_views where viewed_at < now() - interval '180 days';
