-- Restrict sensitive portfolio admin operations to the one existing owner.
-- Do not affect public project/blog reads or existing project table policies.
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
do $$
begin
  if (select count(*) from auth.users) <> 1 then
    raise exception 'Expected exactly one existing portfolio auth user; manual admin assignment required';
  end if;
end $$;
insert into public.portfolio_admins (user_id)
select id from auth.users
on conflict (user_id) do nothing;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.portfolio_admins a
    where a.user_id = (select auth.uid())
  )
$$;
revoke all on function public.is_portfolio_admin() from PUBLIC, anon;
grant execute on function public.is_portfolio_admin() to authenticated;

drop policy if exists "Manage templates when authenticated" on public.website_templates;
create policy "Portfolio admin manages templates"
on public.website_templates for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

drop policy if exists "Portfolio authenticated insert profile" on public.profiles;
drop policy if exists "Portfolio authenticated update profile" on public.profiles;
create policy "Portfolio admin inserts profile" on public.profiles
for insert to authenticated
with check ((select public.is_portfolio_admin()));
create policy "Portfolio admin updates profile" on public.profiles
for update to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

drop policy if exists "Admins upload template files" on storage.objects;
drop policy if exists "Admins view template files" on storage.objects;
drop policy if exists "Admins delete template files" on storage.objects;
create policy "Portfolio admin uploads template files" on storage.objects
for insert to authenticated
with check (bucket_id = 'template-files' and (select public.is_portfolio_admin()));
create policy "Portfolio admin views template files" on storage.objects
for select to authenticated
using (bucket_id = 'template-files' and (select public.is_portfolio_admin()));
create policy "Portfolio admin deletes template files" on storage.objects
for delete to authenticated
using (bucket_id = 'template-files' and (select public.is_portfolio_admin()));