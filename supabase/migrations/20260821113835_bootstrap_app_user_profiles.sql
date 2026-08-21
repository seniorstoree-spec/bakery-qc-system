create policy app_users_self_insert on public.app_users for insert to authenticated with check (auth_user_id = auth.uid());

create or replace function public.normalize_app_user_role()
returns trigger language plpgsql security definer set search_path = public
as $$
declare developer_role uuid; default_role uuid;
begin
  select id into developer_role from public.roles where name='Developer' limit 1;
  select id into default_role from public.roles where name='مهندس جودة' limit 1;
  if lower(coalesce(auth.jwt()->>'email',''))=lower('esalm.kamel@elabdfoods.com') then new.role_id:=developer_role;
  elsif new.role_id is null then new.role_id:=default_role;
  else new.role_id:=default_role; end if;
  return new;
end; $$;

drop trigger if exists normalize_app_user_role on public.app_users;
create trigger normalize_app_user_role before insert or update on public.app_users for each row execute function public.normalize_app_user_role();
