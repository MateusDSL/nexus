import { useState, useEffect, useCallback } from 'react';
import { Message, ChatState } from '../types/chat';
import N8NService, { N8NConfig, N8NMessage } from '../services/n8nService';

interface UseChatProps {
  n8nConfig?: N8NConfig;
  enableN8n?: boolean;
}

export const useChat = ({ n8nConfig, enableN8n = false }: UseChatProps = {}) => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        text: 'Olá! Sou seu assistente IA. Como posso ajudá-lo hoje?',
        sender: 'agent',
        timestamp: new Date()
      }
    ],
    isConnected: true,
    isTyping: false
  });

  const [n8nService, setN8nService] = useState<N8NService | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // Inicializa o serviço n8n
  useEffect(() => {
    if (enableN8n && n8nConfig) {
      const service = new N8NService(n8nConfig);
      setN8nService(service);
      
      // Testa a conexão
      service.testConnection().then((isConnected) => {
        setChatState(prev => ({ ...prev, isConnected }));
      });
    }
  }, [enableN8n, n8nConfig]);

  // Gera um novo ID de sessão
  const generateSessionId = useCallback(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    return newSessionId;
  }, []);

  // Envia mensagem para o n8n
  const sendToN8n = useCallback(async (message: string): Promise<string> => {
    if (!n8nService || !enableN8n) {
      // Modo simulado se n8n não estiver configurado
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Esta é uma resposta simulada. Configure o n8n para usar o agente IA real.');
        }, 1500);
      });
    }

    try {
      const n8nMessage: N8NMessage = {
        question: message,
        sessionId: sessionId || generateSessionId(),
        userId: 'user',
        timestamp: new Date().toISOString()
      };

      const response = await n8nService.sendMessage(n8nMessage);
      return response.answer;
    } catch (error: any) {
      console.error('Erro ao enviar mensagem para n8n:', error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.response?.status === 404) {
        return 'Webhook do n8n não encontrado. Verifique se o workflow está ativo e a URL está correta.';
      } else if (error.response?.status === 500) {
        return 'Erro interno do servidor n8n. Tente novamente em alguns instantes.';
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        return 'Não foi possível conectar ao servidor n8n. Verifique a URL e sua conexão.';
      } else if (error.message?.includes('timeout')) {
        return 'Timeout na conexão com n8n. O servidor pode estar sobrecarregado.';
      }
      
      return 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.';
    }
  }, [n8nService, enableN8n, sessionId, generateSessionId]);

  // Envia uma mensagem
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Adiciona a mensagem do usuário imediatamente
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    try {
      // Envia para o n8n e aguarda resposta
      const response = await sendToN8n(text.trim());

      // Adiciona a resposta do agente
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, agentMessage],
        isTyping: false
      }));
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'agent',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false
      }));
    }
  }, [sendToN8n]);

  // Limpa o chat
  const clearChat = useCallback(() => {
    setChatState({
      messages: [
        {
          id: '1',
          text: 'Chat limpo. Como posso ajudá-lo?',
          sender: 'agent',
          timestamp: new Date()
        }
      ],
      isConnected: chatState.isConnected,
      isTyping: false
    });
    setSessionId('');
  }, [chatState.isConnected]);

  // Atualiza a configuração do n8n
  const updateN8nConfig = useCallback((newConfig: Partial<N8NConfig>) => {
    if (n8nService) {
      n8nService.updateConfig(newConfig);
    }
  }, [n8nService]);

  return {
    chatState,
    sendMessage,
    clearChat,
    updateN8nConfig,
    isN8nEnabled: enableN8n && !!n8nService,
    sessionId
  };
};
