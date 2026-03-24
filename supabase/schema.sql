-- Table users: stockage sécurisé local (hash bcrypt)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  password_hash text not null,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

-- Politique restrictive: toutes les opérations via service_role backend.
create policy "No direct access to users"
on public.users
as permissive
for all
to authenticated, anon
using (false)
with check (false);
