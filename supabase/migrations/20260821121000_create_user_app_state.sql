create table if not exists public.app_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_user_state enable row level security;

create policy "Users can read own app state"
  on public.app_user_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own app state"
  on public.app_user_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own app state"
  on public.app_user_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own app state"
  on public.app_user_state for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists app_user_state_updated_at_idx
  on public.app_user_state(updated_at desc);
