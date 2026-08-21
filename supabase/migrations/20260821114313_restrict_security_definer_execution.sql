revoke execute on function public.normalize_app_user_role() from public, anon, authenticated;
revoke execute on function public.is_developer() from public, anon, authenticated;
grant execute on function public.is_developer() to authenticated;
