import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import ChatHeader from './ChatHeader';
import MessageComponent from './Message';
import MessageInput from './MessageInput';
import DebugPanel from './DebugPanel';
import './ChatContainer.css';

// Configuração do n8n - pode ser movida para variáveis de ambiente
const n8nConfig = {
  baseUrl: process.env.REACT_APP_N8N_BASE_URL || 'https://mateusdsl35.app.n8n.cloud',
  webhookId: process.env.REACT_APP_N8N_WEBHOOK_ID || '7646b5b1-1d9a-4a47-aadc-31b0c77bdda6'
};

const ChatContainer: React.FC = () => {
  const { chatState, sendMessage, isTestingConnection } = useChat({
    n8nConfig
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = (text: string) => {
    sendMessage(text);
  };

  const handleTestConnection = async (): Promise<boolean> => {
    try {
      const url = `${n8nConfig.baseUrl}/webhook/${n8nConfig.webhookId}`;
      console.log('Testando conexão com URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: 'Teste de conexão',
          sessionId: 'test',
          userId: 'debug'
        })
      });
      
      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);
      
      const responseText = await response.text();
      console.log('Conteúdo da resposta:', responseText);
      
      return response.ok;
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      return false;
    }
  };

  return (
    <div className="chat-container">
      <DebugPanel 
        n8nConfig={n8nConfig}
        isN8nEnabled={true}
        onTestConnection={handleTestConnection}
      />
      <ChatHeader 
        isConnected={chatState.isConnected && !isTestingConnection}
        agentName="Nexus AI Agent"
      />
      
      <div className="chat-messages">
        {chatState.messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        {chatState.isTyping && (
          <MessageComponent 
            message={{
              id: 'typing',
              text: '',
              sender: 'agent',
              timestamp: new Date(),
              isTyping: true
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={!chatState.isConnected || isTestingConnection}
        placeholder={isTestingConnection ? "Testando conexão..." : "Digite sua mensagem para o agente IA..."}
      />
    </div>
  );
};

export default ChatContainer;
