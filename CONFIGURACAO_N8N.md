# 🚀 Configuração do Workflow n8n para Nexus Chat

## 📋 Passo a Passo

### 1. Acesse o n8n
- Vá para: https://mateusdsl35.app.n8n.cloud
- Faça login na sua conta

### 2. Crie um Novo Workflow
- Clique em "New Workflow"
- Nomeie como "Nexus Chat"

### 3. Configure o Webhook
- Adicione um nó "Webhook"
- Configure:
  - **HTTP Method**: POST
  - **Path**: `nexus-chat`
  - **Response Mode**: "Respond to Webhook"
- Clique em "Save" e copie a URL do webhook

### 4. Adicione o Nó Function
- Adicione um nó "Function" após o Webhook
- Cole o código abaixo:

```javascript
// Recebe os dados do webhook
const question = $input.first().json.question;
const sessionId = $input.first().json.sessionId || 'default-session';
const userId = $input.first().json.userId || 'anonymous';

console.log('Mensagem recebida:', question);
console.log('Session ID:', sessionId);
console.log('User ID:', userId);

// Simula processamento da IA
const responses = [
  `Olá! Entendi sua pergunta: "${question}". Como posso ajudá-lo melhor?`,
  `Interessante pergunta sobre "${question}". Posso fornecer mais informações sobre isso.`,
  `Obrigado pela pergunta! Sobre "${question}", posso te ajudar com isso.`,
  `Sua pergunta "${question}" foi processada com sucesso!`,
  `Entendi! Você quer saber sobre "${question}". Vou te ajudar.`
];

// Seleciona uma resposta aleatória
const randomResponse = responses[Math.floor(Math.random() * responses.length)];

// Retorna a resposta no formato esperado pela interface
return {
  answer: randomResponse,
  sessionId: sessionId,
  timestamp: new Date().toISOString(),
  originalQuestion: question,
  userId: userId
};
```

### 5. Configure a Resposta
- Adicione um nó "Respond to Webhook"
- Configure:
  - **Respond With**: JSON
  - **Response Body**: `={{ $json }}`

### 6. Conecte os Nós
- Webhook → Function → Respond to Webhook

### 7. Ative o Workflow
- Clique no botão "Active" no canto superior direito
- O workflow deve ficar verde

### 8. Teste a Integração
- Volte para a interface React
- Use o painel de debug (🔧) para testar
- Envie uma mensagem no chat

## ✅ Verificação

Se tudo estiver correto, você deve ver:
- Status "Online" no header
- Respostas do agente IA no chat
- Logs no console do n8n

## 🔧 Troubleshooting

- **Erro 404**: Workflow não está ativo
- **Resposta vazia**: Verifique se o nó Function está retornando JSON
- **Timeout**: Verifique se não há loops infinitos no workflow
