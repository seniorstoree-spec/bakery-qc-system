drop policy if exists role_permissions_developer_write on public.role_permissions;
create policy role_permissions_developer_insert on public.role_permissions for insert to authenticated with check (private.is_developer());
create policy role_permissions_developer_update on public.role_permissions for update to authenticated using (private.is_developer()) with check (private.is_developer());
create policy role_permissions_developer_delete on public.role_permissions for delete to authenticated using (private.is_developer());
drop policy if exists user_permissions_developer_write on public.user_permissions;
create policy user_permissions_developer_insert on public.user_permissions for insert to authenticated with check (private.is_developer());
create policy user_permissions_developer_update on public.user_permissions for update to authenticated using (private.is_developer()) with check (private.is_developer());
create policy user_permissions_developer_delete on public.user_permissions for delete to authenticated using (private.is_developer());
