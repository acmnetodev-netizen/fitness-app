export type Profile = {
  id: string;
  username: string;
  avatarUrl: string | null;
};

export type ConversationSummary = {
  id: string;
  name: string;
  isGroup: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
  memberCount: number;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
  isMine: boolean;
};
