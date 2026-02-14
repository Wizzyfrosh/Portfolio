-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROJECTS TABLE
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  tech_stack text[] default '{}',
  apk_url text,
  live_url text,
  github_url text,
  screenshots text[] default '{}',
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- RLS POLICIES
-- 1. Allow public read access to PUBLISHED projects only
create policy "Public projects are viewable by everyone"
  on public.projects for select
  using ( published = true );

-- 2. Allow admins (authenticated users) to do everything
-- Note: In a real production app with multiple users, you'd check for a specific role.
-- For this personal portfolio, we assume any authenticated user is the 'admin' (you).
create policy "Admins can insert projects"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "Admins can update projects"
  on public.projects for update
  to authenticated
  using (true);

create policy "Admins can delete projects"
  on public.projects for delete
  to authenticated
  using (true);

create policy "Admins can select all projects"
  on public.projects for select
  to authenticated
  using (true);


-- STORAGE BUCKETS
-- You need to create these buckets in the Supabase Dashboard: 'apks', 'screenshots', 'profile'
-- This script sets up the policies for them if they exist.

-- APKs Bucket
insert into storage.buckets (id, name, public)
values ('apks', 'apks', true)
on conflict (id) do nothing;

create policy "Public Access APKs"
  on storage.objects for select
  using ( bucket_id = 'apks' );

create policy "Admin Upload APKs"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'apks' );

create policy "Admin Delete APKs"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'apks' );


-- Screenshots Bucket
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', true)
on conflict (id) do nothing;

create policy "Public Access Screenshots"
  on storage.objects for select
  using ( bucket_id = 'screenshots' );

create policy "Admin Upload Screenshots"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'screenshots' );

create policy "Admin Delete Screenshots"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'screenshots' );

-- Profile Bucket
insert into storage.buckets (id, name, public)
values ('profile', 'profile', true)
on conflict (id) do nothing;

create policy "Public Access Profile"
  on storage.objects for select
  using ( bucket_id = 'profile' );

create policy "Admin Upload Profile"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'profile' );

create policy "Admin Update Profile"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'profile' );
