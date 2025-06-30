export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'bot';
  content: string;
  created_at: string;
}