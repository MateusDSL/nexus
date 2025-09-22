# 🔍 Debug do n8n - Resolvendo "Resposta não disponível"

## 📋 Checklist Rápido

### 1. Verifique o Console do Navegador
- Abra o DevTools (F12)
- Vá para a aba "Console"
- Envie uma mensagem no chat
- Procure por logs que mostram a resposta do n8n

### 2. Verifique o Workflow no n8n

**Passo 1: Acesse o n8n**
- Vá para: https://mateusdsl35.app.n8n.cloud
- Abra o workflow "Nexus Chat"

**Passo 2: Verifique o nó "Respond to Webhook"**
- Clique no nó "Respond to Webhook"
- Verifique se está configurado como:
  - **Respond With**: JSON
  - **Response Body**: `={{ $json }}`

**Passo 3: Verifique o nó "Function"**
- Clique no nó "Function"
- Verifique se o código retorna um objeto com a propriedade `answer`:

```javascript
return {
  answer: "Sua resposta aqui",
  sessionId: sessionId,
  timestamp: new Date().toISOString()
};
```

### 3. Teste Manual do Workflow

**No n8n:**
1. Clique em "Execute Workflow"
2. Envie dados de teste:
   ```json
   {
     "question": "teste",
     "sessionId": "123",
     "userId": "user"
   }
   ```
3. Verifique se retorna algo como:
   ```json
   {
     "answer": "Sua resposta aqui",
     "sessionId": "123",
     "timestamp": "2024-01-01T12:00:00.000Z"
   }
   ```

### 4. Formatos Aceitos pela Interface

A interface agora aceita estes formatos de resposta:

✅ **Formato Ideal:**
```json
{
  "answer": "Sua resposta aqui"
}
```

✅ **Outros Formatos Aceitos:**
```json
{
  "message": "Sua resposta aqui"
}
```

```json
{
  "response": "Sua resposta aqui"
}
```

```json
{
  "text": "Sua resposta aqui"
}
```

```json
{
  "result": "Sua resposta aqui"
}
```

✅ **String Simples:**
```
"Sua resposta aqui"
```

### 5. Logs de Debug

No console do navegador, você deve ver:
```
Resposta completa do n8n: {objeto com a resposta}
Propriedade answer: "valor da resposta"
Tipo da resposta: object
```

Se aparecer:
```
Resposta completa do n8n: {}
Propriedade answer: undefined
```

Significa que o n8n não está retornando dados.

## 🚨 Problemas Comuns

1. **Workflow não ativo**: Verifique se o botão "Active" está verde
2. **Nó Function com erro**: Verifique se o código JavaScript está correto
3. **Nó Respond to Webhook mal configurado**: Deve retornar `={{ $json }}`
4. **Resposta vazia**: O nó Function não está retornando dados

## ✅ Solução Rápida

Se nada funcionar, use este código no nó Function:

```javascript
const question = $input.first().json.question;

return {
  answer: `Você perguntou: "${question}". Esta é uma resposta de teste!`,
  sessionId: $input.first().json.sessionId || 'test',
  timestamp: new Date().toISOString()
};
```
