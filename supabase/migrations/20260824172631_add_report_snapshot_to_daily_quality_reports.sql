alter table public.daily_quality_reports
  add column if not exists report_snapshot jsonb not null default '{}'::jsonb;

comment on column public.daily_quality_reports.report_snapshot is
  'Immutable JSON snapshot of all quality form data captured when the daily report is archived, including IPC compliance states.';
