drop policy if exists user_permissions_self_read on public.user_permissions;
create policy user_permissions_self_read on public.user_permissions for select to authenticated using (exists(select 1 from public.app_users u where u.id=user_permissions.user_id and u.auth_user_id=auth.uid()) or private.is_developer());
drop function if exists public.is_developer();
