export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isTyping: boolean;
}

