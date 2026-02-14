-- Run this in your Supabase SQL Editor to fix the "profiles table not found" error

-- 1. Create PROFILES table
create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resume_url text,
  bio text,
  email text
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. Create RLS Policies
create policy "Public can view profiles"
  on public.profiles for select
  using ( true );

create policy "Admins can update profiles"
  on public.profiles for update
  to authenticated
  using ( true );

create policy "Admins can insert profiles"
  on public.profiles for insert
  to authenticated
  with check ( true );

-- 4. Enable storage for profile (if not already done)
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
