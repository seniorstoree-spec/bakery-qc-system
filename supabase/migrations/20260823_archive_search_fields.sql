-- Archive improvements: support faster filtering by date and report code
-- Safe migration: only adds missing indexes for existing daily quality reports

create index if not exists idx_daily_quality_reports_archive_date
on public.daily_quality_reports (report_date)
where status = 'archived';

create index if not exists idx_daily_quality_reports_archive_department_date
on public.daily_quality_reports (department, report_date)
where status = 'archived';
