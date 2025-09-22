# Nexus Chat - Interface para Agente IA via n8n

Uma interface moderna de chat em React que se conecta exclusivamente com agentes IA via webhook n8n.

## 🚀 Funcionalidades

- Interface de chat moderna e responsiva
- Conexão direta com webhook n8n
- Mensagens em tempo real com animações
- Indicador de digitação
- Status de conexão em tempo real
- Design responsivo para mobile e desktop
- Painel de debug integrado

## 🛠️ Tecnologias

- React 18
- TypeScript
- Axios para requisições HTTP
- CSS3 com animações
- Integração nativa com n8n

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

3. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🔧 Configuração do Webhook n8n

### Configuração Automática

A aplicação já vem configurada com o webhook n8n:

```javascript
const n8nConfig = {
  baseUrl: 'https://mateusdsl35.app.n8n.cloud',
  webhookId: '7646b5b1-1d9a-4a47-aadc-31b0c77bdda6'
};
```

### Personalização via Variáveis de Ambiente

Para usar seu próprio webhook, crie um arquivo `.env`:

```env
REACT_APP_N8N_BASE_URL=https://seu-n8n-instance.com
REACT_APP_N8N_WEBHOOK_ID=seu-webhook-id
REACT_APP_AGENT_NAME=Seu Agente IA
REACT_APP_DEBUG=false
```

### Formato da Resposta do n8n

O webhook do n8n deve retornar um JSON no formato:

```json
{
  "answer": "Resposta do agente IA",
  "sessionId": "session_1234567890_abc123",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Testando a Integração

1. Inicie a aplicação: `npm start`
2. Use o painel de debug (botão 🔧) para testar a conexão
3. Verifique o status de conexão no header
4. Envie uma mensagem para testar a integração completa

### Configuração do Webhook no n8n

1. **Crie um novo workflow no n8n**
2. **Adicione um nó "Webhook"** com:
   - HTTP Method: POST
   - Path: `nexus-chat` (ou qualquer nome)
   - Response Mode: "Respond to Webhook"
3. **Adicione um nó "Function"** para processar a mensagem:
   ```javascript
   // Recebe a mensagem do chat
   const question = $input.first().json.question;
   const sessionId = $input.first().json.sessionId;
   const userId = $input.first().json.userId;
   
   // Processa a pergunta (integre com sua IA aqui)
   const answer = `Você perguntou: "${question}". Esta é uma resposta de exemplo.`;
   
   return {
     answer: answer,
     sessionId: sessionId,
     timestamp: new Date().toISOString()
   };
   ```
4. **Configure o nó de resposta** para retornar o JSON
5. **Ative o workflow**
6. **Teste a URL** do webhook

### ⚠️ Problemas Comuns

- **Webhook ativo mas sem resposta**: Verifique se o workflow está configurado para retornar JSON
- **Erro 404**: Verifique se o workflow está ativo
- **Timeout**: Verifique se o workflow não está travado

## 📱 Interface

A interface inclui:

- **Header**: Status de conexão e informações do agente
- **Área de mensagens**: Histórico de conversa com scroll automático
- **Input**: Campo de texto com envio por Enter ou botão
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

## 🎨 Design

- Gradientes modernos
- Animações suaves
- Indicadores visuais de status
- Typography otimizada
- Cores acessíveis

## 🔒 Segurança

- Vulnerabilidades de alta severidade corrigidas
- Dependências atualizadas para versões seguras
- Apenas 3 vulnerabilidades moderadas restantes (relacionadas ao webpack-dev-server em desenvolvimento)
- Overrides configurados para forçar versões seguras

## 🔮 Próximos Passos

- Autenticação de usuários
- Histórico persistente
- Upload de arquivos
- Emojis e reações
- Múltiplos webhooks
- Configuração dinâmica
