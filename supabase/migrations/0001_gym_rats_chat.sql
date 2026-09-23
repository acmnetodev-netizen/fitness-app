-- Gym Rats chat: a shared "Sala Geral" plus optional named groups.
--
-- NOTE: this schema was already created and configured directly on the
-- Supabase project (RLS + Realtime + storage), independently of this
-- file. This migration documents that live schema for reproducibility
-- on a fresh project — it does not need to be re-run against the
-- current one.

create table if not exists public.chat_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique default upper(substr(md5(random()::text), 1, 6)),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.chat_groups (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique (group_id, user_id)
);

-- messages.group_id is nullable: null means "Sala Geral", the default
-- shared room everyone sees; a real id scopes the message to that group.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text,
  image_url text,
  group_id uuid references public.chat_groups (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages (created_at);
create index if not exists messages_group_id_idx on public.messages (group_id);

alter table public.chat_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.messages enable row level security;

create policy "authenticated users can read groups"
  on public.chat_groups for select
  to authenticated
  using (true);

create policy "authenticated users can create groups"
  on public.chat_groups for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "members can read their own membership rows"
  on public.group_members for select
  to authenticated
  using (true);

create policy "a user can join a group as themselves"
  on public.group_members for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "authenticated users can read messages"
  on public.messages for select
  to authenticated
  using (true);

create policy "authenticated users can send messages"
  on public.messages for insert
  to authenticated
  with check (user_id = auth.uid());

-- Realtime: broadcast INSERTs so rooms update live for everyone.
alter publication supabase_realtime add table public.messages;

-- Storage bucket for chat photos.
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

create policy "chat images are publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'chat-images');

create policy "authenticated users can upload chat images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'chat-images' and owner = auth.uid());
