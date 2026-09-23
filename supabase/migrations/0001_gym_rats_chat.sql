-- Gym Rats chat: a single shared room for all signed-in users.
-- Run this in the Supabase SQL editor (or `supabase db push`) on your project.

-- Defensive cleanup in case the earlier multi-conversation draft of this
-- schema was already applied to this project.
drop table if exists public.conversation_members cascade;
drop table if exists public.conversations cascade;
drop table if exists public.messages cascade;
drop table if exists public.profiles cascade;

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  user_name text not null,
  content text,
  image_url text,
  created_at timestamptz not null default now(),
  constraint chat_messages_have_content check (content is not null or image_url is not null)
);

create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at);

alter table public.chat_messages enable row level security;

create policy "authenticated users can read chat messages"
  on public.chat_messages for select
  to authenticated
  using (true);

create policy "authenticated users can send chat messages"
  on public.chat_messages for insert
  to authenticated
  with check (user_id = auth.uid());

-- Realtime: broadcast INSERTs so the room updates live for everyone.
alter publication supabase_realtime add table public.chat_messages;

-- Storage bucket for chat photos (check-in / message images).
insert into storage.buckets (id, name, public)
values ('chat-media', 'chat-media', true)
on conflict (id) do nothing;

create policy "chat media is publicly readable"
  on storage.objects for select
  to public
  using (bucket_id = 'chat-media');

create policy "authenticated users can upload chat media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'chat-media' and owner = auth.uid());
