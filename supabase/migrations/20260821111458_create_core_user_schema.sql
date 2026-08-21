create extension if not exists pgcrypto;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  name text not null,
  email text unique,
  position text,
  role_id uuid references public.roles(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key(role_id, permission_id)
);

create table public.user_permissions (
  user_id uuid not null references public.app_users(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key(user_id, permission_id)
);
