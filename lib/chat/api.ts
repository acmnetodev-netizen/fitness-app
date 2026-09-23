import { File } from 'expo-file-system';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { ChatGroup, ChatMessage } from '@/types/chat';

type MessageRow = {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  group_id: string | null;
  created_at: string;
};

type GroupRow = {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at: string;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function mapGroupRow(row: GroupRow): ChatGroup {
  return { id: row.id, name: row.name, code: row.code, createdBy: row.created_by, createdAt: row.created_at };
}

export function getDisplayName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName = metadata?.full_name ?? metadata?.name;
  if (typeof fullName === 'string' && fullName.trim()) return fullName.trim();
  if (user.email) return user.email.split('@')[0];
  return 'Gym Rat';
}

/** Messages don't carry a display name, so other members are labelled from their id. */
function fallbackName(userId: string): string {
  return `Gym Rat #${userId.slice(0, 4).toUpperCase()}`;
}

function mapMessageRow(row: MessageRow, currentUserId: string, currentUserName: string): ChatMessage {
  const isMine = row.user_id === currentUserId;
  return {
    id: row.id,
    senderId: row.user_id,
    senderName: isMine ? currentUserName : fallbackName(row.user_id),
    content: row.content,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    isMine,
  };
}

export async function fetchMessages(
  currentUserId: string,
  currentUserName: string,
  groupId: string | null
): Promise<ChatMessage[]> {
  let query = supabase
    .from('messages')
    .select('id, user_id, content, image_url, group_id, created_at')
    .order('created_at', { ascending: true });
  query = groupId ? query.eq('group_id', groupId) : query.is('group_id', null);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => mapMessageRow(row, currentUserId, currentUserName));
}

export async function sendTextMessage(text: string, groupId: string | null) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('Sessão inválida. Inicia sessão novamente.');

  const { error } = await supabase
    .from('messages')
    .insert({ content: trimmed, user_id: user.id, group_id: groupId });
  if (error) throw error;
}

export async function sendImageMessage(localUri: string, groupId: string | null) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('Sessão inválida. Inicia sessão novamente.');

  const file = new File(localUri);
  const bytes = await file.bytes();
  const extension = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const contentType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
  const path = `${user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('chat-images')
    .upload(path, bytes, { contentType });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from('chat-images').getPublicUrl(path);

  const { error: insertError } = await supabase
    .from('messages')
    .insert({ image_url: publicUrlData.publicUrl, user_id: user.id, group_id: groupId });
  if (insertError) throw insertError;
}

export function subscribeToMessages(
  currentUserId: string,
  currentUserName: string,
  groupId: string | null,
  onInsert: (message: ChatMessage) => void
) {
  const channel = supabase
    .channel('messages-feed')
    .on(
      'postgres_changes',
      groupId
        ? { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${groupId}` }
        : { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        const row = payload.new as MessageRow;
        if (!groupId && row.group_id !== null) return; // Sala Geral only: filter client-side
        onInsert(mapMessageRow(row, currentUserId, currentUserName));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function fetchMyGroups(userId: string): Promise<ChatGroup[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select('group:chat_groups(id, name, code, created_by, created_at)')
    .eq('user_id', userId);
  if (error) throw error;

  return (data ?? [])
    .map((row) => one<GroupRow>(row.group))
    .filter((g): g is GroupRow => g !== null)
    .map(mapGroupRow);
}

export async function createGroup(name: string, userId: string): Promise<ChatGroup> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Dá um nome ao grupo.');

  const { data: group, error: createError } = await supabase
    .from('chat_groups')
    .insert({ name: trimmed, created_by: userId })
    .select('id, name, code, created_by, created_at')
    .single();
  if (createError || !group) throw createError ?? new Error('Não foi possível criar o grupo.');

  const { error: memberError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: userId });
  if (memberError) throw memberError;

  return mapGroupRow(group);
}

export async function joinGroupByCode(code: string, userId: string): Promise<ChatGroup> {
  const trimmed = code.trim();
  if (!trimmed) throw new Error('Introduz o código do grupo.');

  const { data: group, error: groupError } = await supabase
    .from('chat_groups')
    .select('id, name, code, created_by, created_at')
    .ilike('code', trimmed)
    .maybeSingle();
  if (groupError) throw groupError;
  if (!group) throw new Error('Não encontrámos nenhum grupo com esse código.');

  const { error: memberError } = await supabase
    .from('group_members')
    .insert({ group_id: group.id, user_id: userId });
  // Ignore "already a member" unique-constraint violations — joining an
  // existing group you're already in should just work.
  if (memberError && memberError.code !== '23505') throw memberError;

  return mapGroupRow(group);
}
