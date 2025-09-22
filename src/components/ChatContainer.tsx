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
  webhookId: process.env.REACT_APP_N8N_WEBHOOK_ID || '7646b5b1-1d9a-4a47-aadc-31b0c77bdda6',
  apiKey: process.env.REACT_APP_N8N_API_KEY || undefined
};

const ChatContainer: React.FC = () => {
  const { chatState, sendMessage, isN8nEnabled, updateN8nConfig } = useChat({
    n8nConfig,
    enableN8n: true // Ativado automaticamente com a URL configurada
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
      const response = await fetch(`${n8nConfig.baseUrl}/webhook/${n8nConfig.webhookId}`, {
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
        isN8nEnabled={isN8nEnabled}
        onTestConnection={handleTestConnection}
      />
      <ChatHeader 
        isConnected={chatState.isConnected}
        agentName={isN8nEnabled ? "Nexus AI Agent (n8n)" : "Nexus AI Agent (Simulado)"}
      />
      
      {!isN8nEnabled && (
        <div className="chat-notice">
          <div className="notice-content">
            <span className="notice-icon">ℹ️</span>
            <span className="notice-text">
              Modo simulado ativo. Configure as variáveis de ambiente para conectar com n8n.
            </span>
          </div>
        </div>
      )}
      
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
        disabled={!chatState.isConnected}
        placeholder={isN8nEnabled ? "Digite sua mensagem para o agente IA..." : "Digite sua mensagem (modo simulado)..."}
      />
    </div>
  );
};

export default ChatContainer;
