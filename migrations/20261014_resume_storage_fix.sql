-- Check that public.profiles exists (schema_v2.sql). Apply in Supabase SQL Editor.
-- Idempotent setup for admin PDF uploads and public PDF access.
insert into storage.buckets (id, name, public)
values ('profile', 'profile', true)
on conflict (id) do update set public = true;
-- Keep any existing size and MIME restrictions unchanged to avoid breaking
-- other profile uploads; PDF size is validated by the admin form.
drop policy if exists "Resume public read" on storage.objects;
create policy "Resume public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'profile');
drop policy if exists "Resume authenticated upload" on storage.objects;
create policy "Resume authenticated upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'profile');
drop policy if exists "Profile public read resume" on public.profiles;
create policy "Profile public read resume" on public.profiles
  for select to anon using (true);
-- Existing authenticated insert/update policies on public.profiles remain unchanged.
