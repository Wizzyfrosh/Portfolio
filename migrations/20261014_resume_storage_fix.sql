-- Check that public.profiles exists (schema_v2.sql). Apply in Supabase SQL Editor.
-- Idempotent setup for admin PDF uploads and public PDF access.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile', 'profile', true, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf'];
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
