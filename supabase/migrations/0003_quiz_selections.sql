-- Store the learner's chosen answers so a completed quiz can be restored
-- (showing their picks + correct answers + explanations) on reload / other devices.
alter table public.quiz_results
  add column if not exists selections jsonb;
