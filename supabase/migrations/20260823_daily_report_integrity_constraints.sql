-- Daily Quality Report integrity rules
-- Ensures archived reports remain consistent with the daily report workflow

alter table if exists daily_quality_reports
add column if not exists archived_at timestamptz;

create index if not exists idx_daily_quality_reports_archive_date
on daily_quality_reports (status, report_date, archived_at);

create index if not exists idx_daily_quality_reports_department_status
on daily_quality_reports (department, status);
