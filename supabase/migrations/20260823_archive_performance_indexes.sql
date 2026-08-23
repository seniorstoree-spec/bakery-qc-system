-- تحسين أداء البحث داخل أرشيف التقارير اليومية
-- الفهارس تخدم البحث حسب القسم والحالة والتاريخ

create index if not exists idx_daily_quality_reports_archive_lookup
on public.daily_quality_reports (department, status, report_date desc);

create index if not exists idx_daily_quality_reports_archived_at
on public.daily_quality_reports (archived_at desc);
