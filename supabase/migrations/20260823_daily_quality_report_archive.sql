-- Daily quality report archive foundation
-- Creates the parent entity for one report per day.

create table if not exists public.daily_quality_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null,
  section text not null default 'bakery',
  shift text,
  status text not null default 'open',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists daily_quality_reports_date_idx
on public.daily_quality_reports(report_date);

create index if not exists daily_quality_reports_archive_idx
on public.daily_quality_reports(archived_at);
