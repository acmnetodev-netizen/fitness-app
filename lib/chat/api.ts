import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types/chat';

type MessageRow = {
  id: string;
  user_id: string;
  content: string | null;
  created_at: string;
};

export function getDisplayName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName = metadata?.full_name ?? metadata?.name;
  if (typeof fullName === 'string' && fullName.trim()) return fullName.trim();
  if (user.email) return user.email.split('@')[0];
  return 'Gym Rat';
}

/** The table has no user_name column, so other members are labelled from their id. */
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
    createdAt: row.created_at,
    isMine,
  };
}

export async function fetchMessages(currentUserId: string, currentUserName: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, user_id, content, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => mapMessageRow(row, currentUserId, currentUserName));
}

export async function sendTextMessage(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('Sessão inválida. Inicia sessão novamente.');

  const { error } = await supabase.from('messages').insert({ content: trimmed, user_id: user.id });
  if (error) throw error;
}

export function subscribeToMessages(
  currentUserId: string,
  currentUserName: string,
  onInsert: (message: ChatMessage) => void
) {
  const channel = supabase
    .channel('messages-feed')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        const row = payload.new as MessageRow;
        onInsert(mapMessageRow(row, currentUserId, currentUserName));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
