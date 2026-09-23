import { File } from 'expo-file-system';

import { supabase } from '@/lib/supabase';
import type { ChatMessage, ConversationSummary, Profile } from '@/types/chat';

type ConversationRow = {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  image_path: string | null;
  created_at: string;
  sender?: { username: string } | null;
};

// Supabase's untyped client can't know FK cardinality, so it types nested
// joins as arrays even for many-to-one relations; this normalizes either shape.
function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function resolveImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  return supabase.storage.from('chat-media').getPublicUrl(imagePath).data.publicUrl;
}

function mapMessageRow(row: MessageRow, currentUserId: string): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    senderName: row.sender?.username ?? 'Gym Rat',
    content: row.content,
    imageUrl: resolveImageUrl(row.image_path),
    createdAt: row.created_at,
    isMine: row.sender_id === currentUserId,
  };
}

export async function fetchConversations(userId: string): Promise<ConversationSummary[]> {
  const { data: memberships, error } = await supabase
    .from('conversation_members')
    .select('conversation:conversations(id, name, is_group, created_at)')
    .eq('user_id', userId);
  if (error) throw error;

  const conversations = (memberships ?? [])
    .map((row) => one<ConversationRow>(row.conversation))
    .filter((c): c is ConversationRow => c !== null);
  if (conversations.length === 0) return [];

  const conversationIds = conversations.map((c) => c.id);

  const [{ data: members, error: membersError }, { data: lastMessages, error: messagesError }] =
    await Promise.all([
      supabase
        .from('conversation_members')
        .select('conversation_id, profile:profiles(id, username)')
        .in('conversation_id', conversationIds),
      supabase
        .from('messages')
        .select('conversation_id, content, image_path, created_at')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false }),
    ]);
  if (membersError) throw membersError;
  if (messagesError) throw messagesError;

  const memberCountByConversation = new Map<string, number>();
  const otherMemberNameByConversation = new Map<string, string>();
  for (const row of members ?? []) {
    const profile = one<{ id: string; username: string }>(row.profile);
    memberCountByConversation.set(
      row.conversation_id,
      (memberCountByConversation.get(row.conversation_id) ?? 0) + 1
    );
    if (profile && profile.id !== userId && !otherMemberNameByConversation.has(row.conversation_id)) {
      otherMemberNameByConversation.set(row.conversation_id, profile.username);
    }
  }

  const lastMessageByConversation = new Map<string, { preview: string; createdAt: string }>();
  for (const message of lastMessages ?? []) {
    if (lastMessageByConversation.has(message.conversation_id)) continue;
    lastMessageByConversation.set(message.conversation_id, {
      preview: message.content ?? '📷 Foto',
      createdAt: message.created_at,
    });
  }

  return conversations
    .map((conversation): ConversationSummary => {
      const last = lastMessageByConversation.get(conversation.id);
      return {
        id: conversation.id,
        name: conversation.name ?? otherMemberNameByConversation.get(conversation.id) ?? 'Gym Rat',
        isGroup: conversation.is_group,
        lastMessage: last?.preview ?? null,
        lastMessageAt: last?.createdAt ?? conversation.created_at,
        memberCount: memberCountByConversation.get(conversation.id) ?? 0,
      };
    })
    .sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''));
}

export async function fetchMessages(
  conversationId: string,
  currentUserId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, content, image_path, created_at, sender:profiles(username)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) =>
    mapMessageRow(
      { ...row, sender: one<{ username: string }>(row.sender) } as MessageRow,
      currentUserId
    )
  );
}

export async function sendTextMessage(conversationId: string, senderId: string, content: string) {
  const trimmed = content.trim();
  if (!trimmed) return;
  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content: trimmed });
  if (error) throw error;
}

export async function sendImageMessage(conversationId: string, senderId: string, localUri: string) {
  const file = new File(localUri);
  const bytes = await file.bytes();
  const extension = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const contentType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
  const path = `${conversationId}/${senderId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('chat-media')
    .upload(path, bytes, { contentType });
  if (uploadError) throw uploadError;

  const { error: insertError } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, image_path: path });
  if (insertError) throw insertError;
}

export function subscribeToMessages(
  conversationId: string,
  currentUserId: string,
  onInsert: (message: ChatMessage) => void
) {
  const channel = supabase
    .channel(`messages-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      async (payload) => {
        const row = payload.new as MessageRow;
        if (row.sender_id === currentUserId) return; // already rendered optimistically
        const { data: sender } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', row.sender_id)
          .single();
        onInsert(mapMessageRow({ ...row, sender }, currentUserId));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function searchProfiles(query: string, excludeUserId: string): Promise<Profile[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .ilike('username', `%${trimmed}%`)
    .neq('id', excludeUserId)
    .limit(20);
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: row.id, username: row.username, avatarUrl: row.avatar_url }));
}

export async function findOrCreateDirectConversation(
  currentUserId: string,
  otherUserId: string
): Promise<string> {
  const [{ data: mine, error: mineError }, { data: theirs, error: theirsError }] = await Promise.all([
    supabase
      .from('conversation_members')
      .select('conversation_id, conversation:conversations(is_group)')
      .eq('user_id', currentUserId),
    supabase.from('conversation_members').select('conversation_id').eq('user_id', otherUserId),
  ]);
  if (mineError) throw mineError;
  if (theirsError) throw theirsError;

  const theirConversationIds = new Set((theirs ?? []).map((row) => row.conversation_id));
  const existing = (mine ?? []).find((row) => {
    const conversation = one<{ is_group: boolean }>(row.conversation);
    return conversation && !conversation.is_group && theirConversationIds.has(row.conversation_id);
  });
  if (existing) return existing.conversation_id;

  const { data: conversation, error: createError } = await supabase
    .from('conversations')
    .insert({ is_group: false, created_by: currentUserId })
    .select('id')
    .single();
  if (createError || !conversation) throw createError ?? new Error('Failed to create conversation');

  const { error: membersError } = await supabase.from('conversation_members').insert([
    { conversation_id: conversation.id, user_id: currentUserId },
    { conversation_id: conversation.id, user_id: otherUserId },
  ]);
  if (membersError) throw membersError;

  return conversation.id as string;
}
