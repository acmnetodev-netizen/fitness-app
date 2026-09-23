export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string | null;
  createdAt: string;
  isMine: boolean;
};
