-- Run in Supabase SQL Editor BEFORE merging the case-study feature.
-- Safe, additive migration: preserves all current projects and policies.
alter table public.projects
  add column if not exists case_study_challenge text,
  add column if not exists case_study_solution text,
  add column if not exists case_study_process text,
  add column if not exists case_study_results text;
