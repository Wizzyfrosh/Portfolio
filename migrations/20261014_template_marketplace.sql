-- Apply manually in Supabase SQL Editor before enabling the store.
-- No existing table is removed or altered.
create table if not exists public.website_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  cover_image text,
  demo_url text,
  price_kobo integer not null check (price_kobo >= 100),
  file_path text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.template_orders (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.website_templates(id) on delete restrict,
  email text not null,
  reference text not null unique,
  amount_kobo integer not null check (amount_kobo > 0),
  currency text not null default 'NGN' check (currency = 'NGN'),
  status text not null default 'pending' check (status in ('pending','paid')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists template_orders_template_id_idx on public.template_orders(template_id);
alter table public.website_templates enable row level security;
alter table public.template_orders enable row level security;
drop policy if exists "View published website templates" on public.website_templates;
create policy "View published website templates" on public.website_templates for select to anon using (published = true);
drop policy if exists "Manage templates when authenticated" on public.website_templates;
create policy "Manage templates when authenticated" on public.website_templates for all to authenticated using (true) with check (true);
-- No client read/write policy on orders: server operations use SUPABASE_SERVICE_ROLE_KEY.
insert into storage.buckets (id,name,public) values ('template-files','template-files',false) on conflict (id) do nothing;
-- Keep existing screenshot bucket as the public cover-image store.
drop policy if exists "Admins upload template files" on storage.objects;
create policy "Admins upload template files" on storage.objects for insert to authenticated with check (bucket_id = 'template-files');
drop policy if exists "Admins view template files" on storage.objects;
create policy "Admins view template files" on storage.objects for select to authenticated using (bucket_id = 'template-files');
drop policy if exists "Admins delete template files" on storage.objects;
create policy "Admins delete template files" on storage.objects for delete to authenticated using (bucket_id = 'template-files');
