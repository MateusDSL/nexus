# Nexus Chat - Interface para Agente IA

Uma interface moderna de chat em React para conectar com agentes IA via n8n.

## 🚀 Funcionalidades

- Interface de chat moderna e responsiva
- Mensagens em tempo real com animações
- Indicador de digitação
- Status de conexão
- Design responsivo para mobile e desktop
- Preparado para integração com n8n

## 🛠️ Tecnologias

- React 18
- TypeScript
- CSS3 com animações
- Estrutura preparada para n8n

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

## 🔧 Configuração para n8n

### Método 1: Variáveis de Ambiente (Recomendado)

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_N8N_BASE_URL=https://mateusdsl35.app.n8n.cloud
REACT_APP_N8N_WEBHOOK_ID=7646b5b1-1d9a-4a47-aadc-31b0c77bdda6
REACT_APP_N8N_API_KEY=sua-api-key-opcional
REACT_APP_AGENT_NAME=Nexus AI Agent
REACT_APP_DEBUG=false
```

**Nota**: A URL do webhook já está configurada no código como padrão. Você pode sobrescrever usando as variáveis de ambiente.

### Método 2: Arquivo de Configuração

1. Copie `config.example.js` para `config.js`
2. Ajuste as configurações conforme necessário

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

1. Configure as variáveis de ambiente
2. Inicie a aplicação: `npm start`
3. A interface mostrará "Nexus AI Agent (n8n)" no header
4. Use o painel de debug (botão 🔧) para testar a conexão
5. Envie uma mensagem para testar a integração completa

### Configuração do Webhook no n8n

1. Crie um novo workflow no n8n
2. Adicione um nó "Webhook" com:
   - HTTP Method: POST
   - Path: `nexus-chat` (ou qualquer nome)
   - Response Mode: "Respond to Webhook"
3. Adicione um nó "Function" para processar a mensagem
4. Configure o nó de resposta para retornar o JSON no formato esperado
5. Ative o workflow
6. Copie a URL do webhook e atualize no código

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

- Integração completa com n8n
- Autenticação de usuários
- Histórico persistente
- Upload de arquivos
- Emojis e reações
