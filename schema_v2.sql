-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- BLOGS TABLE
create table if not exists public.blogs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  published boolean default false
);

-- PROFILES TABLE (Singleton or per-user)
create table if not exists public.profiles (
  id uuid default uuid_generate_v4() primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resume_url text,
  bio text,
  email text
);

-- RLS POLICIES FOR BLOGS
alter table public.blogs enable row level security;

create policy "Public can view published blogs"
  on public.blogs for select
  using ( published = true );

create policy "Admins can view all blogs"
  on public.blogs for select
  to authenticated
  using ( true );

create policy "Admins can insert blogs"
  on public.blogs for insert
  to authenticated
  with check ( true );

create policy "Admins can update blogs"
  on public.blogs for update
  to authenticated
  using ( true );

create policy "Admins can delete blogs"
  on public.blogs for delete
  to authenticated
  using ( true );

-- RLS POLICIES FOR PROFILES
alter table public.profiles enable row level security;

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

-- STORAGE POLICIES
-- We need to allow access to 'blog-images' and 'profile' buckets
-- Create these buckets in Supabase Dashboard: 'blog-images', 'profile'

-- Policy to allow public access to new buckets
-- Note: You might need to drop existing policy if it conflicts, or just add a new one.
-- Simplest is to create a specific policy for these buckets.

create policy "Public Access Blog/Profile"
  on storage.objects for select
  using ( bucket_id in ('blog-images', 'profile') );

create policy "Admin Upload Blog/Profile"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id in ('blog-images', 'profile') );

create policy "Admin Update Blog/Profile"
  on storage.objects for update
  to authenticated
  using ( bucket_id in ('blog-images', 'profile') );

create policy "Admin Delete Blog/Profile"
  on storage.objects for delete
  to authenticated
  using ( bucket_id in ('blog-images', 'profile') );
