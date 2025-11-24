# Guia de Testes

Este documento fornece instruções para testar o backend WhatsApp AI.

## 🧪 Testando Localmente

### 1. Testar o Servidor

Inicie o servidor:
```bash
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3000
📍 URL: http://localhost:3000
```

### 2. Testar Health Check

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Testar Envio de Mensagem Manual

```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "5511999999999",
    "message": "Olá! Esta é uma mensagem de teste."
  }'
```

**Nota:** Substitua `5511999999999` pelo número real (com código do país, sem símbolos).

### 4. Testar Webhook (Simulação)

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Olá, preciso de ajuda!",
    "name": "João Silva"
  }'
```

### 5. Testar Listagem de Mensagens

```bash
curl http://localhost:3000/api/messages
```

Ou com paginação:
```bash
curl "http://localhost:3000/api/messages?limit=10&offset=0"
```

## 🔧 Configurando o Webhook na Z-API

1. Acesse o painel da Z-API
2. Vá em **Configurações** > **Webhook**
3. Configure a URL do webhook:
   - **URL:** `http://seu-dominio.com/api/webhook`
   - **Método:** POST
   - **Eventos:** Mensagens recebidas

**Para desenvolvimento local, use um túnel:**
- **ngrok:** `ngrok http 3000`
- **localhost.run:** `ssh -R 80:localhost:3000 ssh.localhost.run`
- **Cloudflare Tunnel:** `cloudflared tunnel --url http://localhost:3000`

## 📝 Verificar Logs

O servidor registra todas as ações no console:
- 📥 Mensagens recebidas
- 📤 Mensagens enviadas
- 🤖 Respostas geradas pela IA

## ⚠️ Solução de Problemas

### Erro ao enviar mensagem via Z-API
- Verifique se `ZAPI_INSTANCE_ID` e `ZAPI_TOKEN` estão corretos
- Confirme que a instância está ativa no painel da Z-API
- Verifique os logs do servidor para mais detalhes

### Erro ao gerar resposta com OpenAI
- Verifique se `OPENAI_API_KEY` está válida
- Confirme que há créditos disponíveis na conta OpenAI
- Verifique os logs para ver o erro específico

## 🎯 Próximos Passos

1. Configure o webhook na Z-API com uma URL pública (use ngrok ou similar)
2. Teste enviando uma mensagem real do WhatsApp
3. Verifique se a resposta automática foi enviada

