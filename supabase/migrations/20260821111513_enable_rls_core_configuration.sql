alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.app_users enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_permissions enable row level security;
alter table public.app_sections enable row level security;
alter table public.app_settings enable row level security;
alter table public.app_texts enable row level security;
alter table public.app_theme enable row level security;
alter table public.app_branding enable row level security;
alter table public.audit_logs enable row level security;

create policy roles_authenticated_read on public.roles for select to authenticated using (true);
create policy permissions_authenticated_read on public.permissions for select to authenticated using (true);
create policy sections_authenticated_read on public.app_sections for select to authenticated using (true);
create policy settings_authenticated_read on public.app_settings for select to authenticated using (true);
create policy texts_authenticated_read on public.app_texts for select to authenticated using (true);
create policy theme_authenticated_read on public.app_theme for select to authenticated using (true);
create policy branding_authenticated_read on public.app_branding for select to authenticated using (true);
