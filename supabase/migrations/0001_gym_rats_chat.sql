-- Gym Rats chat schema: profiles, conversations, membership, messages.
-- Run this in the Supabase SQL editor (or `supabase db push`) on your project.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  name text,
  is_group boolean not null default false,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  content text,
  image_path text,
  created_at timestamptz not null default now(),
  constraint messages_have_content check (content is not null or image_path is not null)
);

create index if not exists messages_conversation_id_created_at_idx
  on public.messages (conversation_id, created_at);

-- Row Level Security: a user may only see conversations/messages they belong to.

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

create policy "profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "a user can upsert their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "a user can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

create policy "members can read their conversations"
  on public.conversations for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = id and cm.user_id = auth.uid()
    )
  );

create policy "authenticated users can create conversations"
  on public.conversations for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "members can read their membership rows"
  on public.conversation_members for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversation_members.conversation_id and cm.user_id = auth.uid()
    )
  );

create policy "a user can add members to a conversation they created"
  on public.conversation_members for insert
  to authenticated
  with check (
    user_id = auth.uid()
    or exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.created_by = auth.uid()
    )
  );

create policy "members can read messages in their conversations"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
    )
  );

create policy "members can send messages in their conversations"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
    )
  );

-- Realtime: broadcast INSERTs on messages so chat rooms update live.
alter publication supabase_realtime add table public.messages;

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
