import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Serviço para integração com n8n
export interface N8NConfig {
  baseUrl: string;
  webhookId: string;
  apiKey?: string;
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

class N8NService {
  private config: N8NConfig;
  private axiosInstance: AxiosInstance;

  constructor(config: N8NConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000, // 30 segundos de timeout
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
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

      const response: AxiosResponse<N8NResponse> = await this.axiosInstance.post(
        `/webhook/${this.config.webhookId}`,
        payload
      );

      return {
        answer: response.data.answer || 'Resposta não disponível',
        sessionId: response.data.sessionId || payload.sessionId,
        timestamp: response.data.timestamp || new Date().toISOString(),
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
      const response = await this.axiosInstance.get(`/webhook/${this.config.webhookId}`);
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao testar conexão com n8n:', error);
      return false;
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
    if (newConfig.apiKey) {
      this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${newConfig.apiKey}`;
    }
  }
}

export default N8NService;
