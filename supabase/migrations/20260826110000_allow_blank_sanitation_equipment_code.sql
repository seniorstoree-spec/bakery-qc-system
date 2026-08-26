-- Sanitation equipment codes are optional in the checklist.
-- The UI intentionally initializes equipmentCode as an empty string when a physical
-- code is not assigned, so the child row must accept NULL.
alter table public.sanitation_equipment_checks
  alter column equipment_code drop not null;
