-- Per-user quiz results. One row per (user, quiz); re-takes update in place.
-- Run this in the Supabase SQL editor after 0001_progress.sql.

create table if not exists public.quiz_results (
  user_id      uuid not null references auth.users (id) on delete cascade,
  quiz_id      text not null,            -- e.g. "topics/sorting/bubble"
  score        int  not null,            -- correct answers in the latest attempt
  total        int  not null,            -- number of questions
  best_score   int  not null,            -- best correct count across attempts
  attempts     int  not null default 1,
  completed_at timestamptz not null default now(),
  primary key (user_id, quiz_id)
);

alter table public.quiz_results enable row level security;

create policy "read own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "insert own quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

create policy "update own quiz results"
  on public.quiz_results for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own quiz results"
  on public.quiz_results for delete
  using (auth.uid() = user_id);
