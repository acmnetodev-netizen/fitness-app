import { File } from 'expo-file-system';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types/chat';

type ChatMessageRow = {
  id: string;
  user_id: string;
  user_name: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
};

export function getDisplayName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName = metadata?.full_name ?? metadata?.name;
  if (typeof fullName === 'string' && fullName.trim()) return fullName.trim();
  if (user.email) return user.email.split('@')[0];
  return 'Gym Rat';
}

function mapMessageRow(row: ChatMessageRow, currentUserId: string): ChatMessage {
  return {
    id: row.id,
    senderId: row.user_id,
    senderName: row.user_name,
    content: row.content,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    isMine: row.user_id === currentUserId,
  };
}

export async function fetchMessages(currentUserId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, user_id, user_name, content, image_url, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => mapMessageRow(row, currentUserId));
}

export async function sendTextMessage(userId: string, userName: string, content: string) {
  const trimmed = content.trim();
  if (!trimmed) return;
  const { error } = await supabase
    .from('chat_messages')
    .insert({ user_id: userId, user_name: userName, content: trimmed });
  if (error) throw error;
}

export async function sendImageMessage(userId: string, userName: string, localUri: string) {
  const file = new File(localUri);
  const bytes = await file.bytes();
  const extension = localUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const contentType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`;
  const path = `${userId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('chat-media')
    .upload(path, bytes, { contentType });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from('chat-media').getPublicUrl(path);

  const { error: insertError } = await supabase
    .from('chat_messages')
    .insert({ user_id: userId, user_name: userName, image_url: publicUrlData.publicUrl });
  if (insertError) throw insertError;
}

export function subscribeToMessages(currentUserId: string, onInsert: (message: ChatMessage) => void) {
  const channel = supabase
    .channel('chat_messages-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages' },
      (payload) => {
        const row = payload.new as ChatMessageRow;
        if (row.user_id === currentUserId) return; // already rendered optimistically
        onInsert(mapMessageRow(row, currentUserId));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
