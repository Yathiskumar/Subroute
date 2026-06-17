-- Progress storage for signed-in learners.
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  roadmap_slug text not null,
  topic_id     text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, roadmap_slug, topic_id)
);

-- Each user reads/writes only their own rows.
alter table public.progress enable row level security;

create policy "read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "delete own progress"
  on public.progress for delete
  using (auth.uid() = user_id);

-- Fast lookups by user + roadmap.
create index if not exists progress_user_roadmap_idx
  on public.progress (user_id, roadmap_slug);
