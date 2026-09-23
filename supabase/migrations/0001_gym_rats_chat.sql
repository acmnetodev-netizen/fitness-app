-- Gym Rats chat: a single shared room for all signed-in users.
--
-- NOTE: this table was already created and configured directly on the
-- Supabase project (RLS + Realtime), independently of this file. This
-- migration documents that live schema for reproducibility on a fresh
-- project — it does not need to be re-run against the current one.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at);

alter table public.messages enable row level security;

create policy "authenticated users can read messages"
  on public.messages for select
  to authenticated
  using (true);

create policy "authenticated users can send messages"
  on public.messages for insert
  to authenticated
  with check (user_id = auth.uid());

-- Realtime: broadcast INSERTs so the room updates live for everyone.
alter publication supabase_realtime add table public.messages;
