// Configurações para integração com n8n
// Copie este arquivo para config.js e ajuste as configurações

export const n8nConfig = {
  baseUrl: process.env.REACT_APP_N8N_BASE_URL || 'https://mateusdsl35.app.n8n.cloud',
  webhookId: process.env.REACT_APP_N8N_WEBHOOK_ID || '7646b5b1-1d9a-4a47-aadc-31b0c77bdda6',
  agentName: process.env.REACT_APP_AGENT_NAME || 'Nexus AI Agent',
  debug: process.env.REACT_APP_DEBUG === 'true' || false
};

// Exemplo de uso:
// 1. Configure as variáveis de ambiente no arquivo .env
// 2. Ou modifique diretamente os valores abaixo
// 3. A aplicação detectará automaticamente se o n8n está configurado

export default n8nConfig;
