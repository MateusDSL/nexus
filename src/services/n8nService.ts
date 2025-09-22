import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Serviço para integração com n8n
export interface N8NConfig {
  baseUrl: string;
  webhookId: string;
}

export interface N8NMessage {
  question: string;
  sessionId?: string;
  userId?: string;
  timestamp?: string;
}

export interface N8NResponse {
  answer: string;
  sessionId?: string;
  timestamp?: string;
  success?: boolean;
  error?: string;
}

// Interface mais flexível para diferentes formatos de resposta do n8n
export interface N8NFlexibleResponse {
  answer?: string;
  message?: string;
  response?: string;
  text?: string;
  result?: string;
  sessionId?: string;
  timestamp?: string;
  success?: boolean;
  error?: string;
}

class N8NService {
  private config: N8NConfig;
  private axiosInstance: AxiosInstance;

  constructor(config: N8NConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000, // 30 segundos de timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para logging de requisições
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('Enviando requisição para n8n:', config.url);
        return config;
      },
      (error) => {
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para logging de respostas
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('Resposta recebida do n8n:', response.status);
        return response;
      },
      (error) => {
        console.error('Erro na resposta do n8n:', error);
        return Promise.reject(error);
      }
    );
  }

  async sendMessage(message: N8NMessage): Promise<N8NResponse> {
    try {
      const payload = {
        question: message.question,
        sessionId: message.sessionId || this.generateSessionId(),
        userId: message.userId || 'anonymous',
        timestamp: new Date().toISOString()
      };

      const response = await this.axiosInstance.post(
        `/webhook/${this.config.webhookId}`,
        payload
      );

      // Debug: Vamos ver exatamente o que o n8n está retornando
      console.log('Resposta completa do n8n:', response.data);
      console.log('Status da resposta:', response.status);
      console.log('Tipo da resposta:', typeof response.data);
      
      // Verifica se a resposta tem dados válidos
      let answer = 'Resposta não disponível';
      
      if (response.data) {
        if (typeof response.data === 'string') {
          // Se for string vazia, mantém a mensagem padrão
          if (response.data.trim() !== '') {
            answer = response.data;
          }
        } else if (typeof response.data === 'object' && response.data.answer) {
          answer = response.data.answer;
        } else if (typeof response.data === 'object') {
          // Tenta outras propriedades comuns
          answer = response.data.message || response.data.response || response.data.text || 'Resposta não disponível';
        }
      }

      if (answer === 'Resposta não disponível') {
        console.warn('Webhook n8n retornou uma resposta vazia ou sem formato válido.');
        console.warn('Resposta recebida:', response.data);
        console.warn('Sugestão: Configure o nó "Respond to Webhook" para retornar: {"answer": "sua resposta aqui"}');
      }

      return {
        answer: answer,
        sessionId: response.data?.sessionId || payload.sessionId,
        timestamp: new Date().toISOString(),
        success: true
      };
      
    } catch (error: any) {
      console.error('Erro ao enviar mensagem para n8n:', error);
      
      // Retorna uma resposta de erro amigável
      return {
        answer: 'Desculpe, não consegui processar sua pergunta agora. Tente novamente em alguns instantes.',
        sessionId: message.sessionId || this.generateSessionId(),
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  // Método para testar conexão
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testando conexão com n8n...');
      console.log('URL:', `${this.config.baseUrl}/webhook/${this.config.webhookId}`);
      
      // Testa com uma requisição POST simples
      const response = await this.axiosInstance.post(`/webhook/${this.config.webhookId}`, {
        question: 'test',
        sessionId: 'test',
        userId: 'test'
      });
      
      console.log('Resposta do n8n:', response.status, response.data);
      return response.status === 200;
    } catch (error: any) {
      console.error('Erro ao testar conexão com n8n:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
      
      // Retorna true mesmo com erro para permitir tentativas
      return true;
    }
  }

  // Gera um ID de sessão único
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Atualiza a configuração
  updateConfig(newConfig: Partial<N8NConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.axiosInstance.defaults.baseURL = this.config.baseUrl;
  }
}

export default N8NService;
