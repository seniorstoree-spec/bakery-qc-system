-- Complete only the fields that exist in the original daily quality report
-- but were missing from the application data model.

alter table public.defect_logs
  add column if not exists allowable_limit_3_pct numeric not null default 3,
  add column if not exists allowable_limit_5_pct numeric not null default 5,
  add column if not exists critical_release_limit_pct numeric not null default 0;

alter table public.metal_detector_records
  add column if not exists fe_critical_mm numeric not null default 2.5,
  add column if not exists nfe_critical_mm numeric not null default 3.0,
  add column if not exists ss_critical_mm numeric not null default 3.5;

alter table public.product_weight_specs
  add column if not exists dough_weight_time text,
  add column if not exists baked_weight_time text,
  add column if not exists filled_weight numeric,
  add column if not exists filled_weight_min numeric,
  add column if not exists filled_weight_max numeric,
  add column if not exists filled_weight_time text,
  add column if not exists finished_weight_time text;

alter table public.sensory_evaluations
  add column if not exists matrix_min_score numeric not null default 0,
  add column if not exists matrix_max_score numeric not null default 10;

comment on column public.defect_logs.allowable_limit_3_pct is 'QC-IS-FM-01-03 allowable limit for the 3% sample threshold';
comment on column public.defect_logs.allowable_limit_5_pct is 'QC-IS-FM-01-03 allowable limit for the 5% sample threshold';
comment on column public.defect_logs.critical_release_limit_pct is 'Critical release limit reference from QC-IS-FM-01-03';
comment on column public.metal_detector_records.fe_critical_mm is 'QC-IS-FM-01-11 FE critical limit: 2.5 mm';
comment on column public.metal_detector_records.nfe_critical_mm is 'QC-IS-FM-01-11 NFe critical limit: 3.0 mm';
comment on column public.metal_detector_records.ss_critical_mm is 'QC-IS-FM-01-11 SS critical limit: 3.5 mm';
