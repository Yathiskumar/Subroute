-- Grant table privileges to the database roles.
--
-- ROOT CAUSE FIX: migrations 0001/0002 created the tables and RLS *policies*
-- but never granted table-level privileges to the `authenticated` role. In
-- PostgREST/Supabase, access needs BOTH a GRANT and an RLS policy. Without the
-- GRANT, every signed-in read/write failed with:
--     42501  "permission denied for table progress"
-- The client swallowed that error, so cloud sync silently no-op'd and progress
-- lived only in localStorage — and was lost the moment the browser was cleared.
--
-- RLS still restricts each user to their own rows; these grants only open the
-- door so the policies can be evaluated at all. `anon` is intentionally left
-- without access — progress/quizzes are synced for signed-in users only.
--
-- Run this in the Supabase SQL editor (or via `supabase db push`).

grant usage on schema public to authenticated;

grant select, insert, update, delete on public.progress      to authenticated;
grant select, insert, update, delete on public.quiz_results  to authenticated;

-- 0001 created select/insert/delete policies for `progress` but no UPDATE policy,
-- so the client's upsert-on-conflict (which becomes an UPDATE for an existing
-- row) was blocked. Add it. (quiz_results already has its update policy in 0002.)
drop policy if exists "update own progress" on public.progress;
create policy "update own progress"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
