create table public.app_sections (
  id uuid primary key default gen_random_uuid(), key text not null unique, name text not null,
  description text, sort_order integer not null default 0, is_enabled boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.app_settings (
  id uuid primary key default gen_random_uuid(), setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table public.app_texts (
  id uuid primary key default gen_random_uuid(), text_key text not null unique, text_value text not null,
  font_family text, font_size numeric, font_weight text, updated_at timestamptz not null default now()
);
create table public.app_theme (
  id uuid primary key default gen_random_uuid(), theme_key text not null unique, value text not null,
  updated_at timestamptz not null default now()
);
create table public.app_branding (
  id uuid primary key default gen_random_uuid(), logo_url text, logo_alt text,
  updated_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), actor_user_id uuid references public.app_users(id) on delete set null,
  action text not null, entity_type text, entity_id text, details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
