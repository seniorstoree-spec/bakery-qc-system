create index if not exists idx_app_users_role_id on public.app_users(role_id);
create index if not exists idx_audit_logs_actor_user_id on public.audit_logs(actor_user_id);
create index if not exists idx_role_permissions_permission_id on public.role_permissions(permission_id);
create index if not exists idx_user_permissions_permission_id on public.user_permissions(permission_id);
drop policy if exists app_users_self_insert on public.app_users;
create policy app_users_self_insert on public.app_users for insert to authenticated with check ((select auth.uid())=auth_user_id);
drop policy if exists user_permissions_self_read on public.user_permissions;
create policy user_permissions_self_read on public.user_permissions for select to authenticated using (exists(select 1 from public.app_users u where u.id=user_permissions.user_id and u.auth_user_id=(select auth.uid())) or private.is_developer());
