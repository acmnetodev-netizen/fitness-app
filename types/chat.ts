export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
  isMine: boolean;
};

export type ChatGroup = {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: string;
};
