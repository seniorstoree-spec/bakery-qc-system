-- Keep report metadata consistent when a report is archived or updated.
alter table public.daily_quality_reports
  drop constraint if exists daily_quality_reports_created_by_fkey;

alter table public.daily_quality_reports
  add constraint daily_quality_reports_created_by_fkey
  foreign key (created_by) references auth.users(id);

create index if not exists idx_daily_quality_reports_created_by
  on public.daily_quality_reports(created_by);

create or replace function public.set_daily_quality_reports_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
