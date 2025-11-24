# 🚀 Início Rápido

Guia rápido para começar a usar o backend em 5 minutos.

## ⚡ Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Copie .env.example para .env e preencha com suas credenciais

# 3. Iniciar servidor
npm run dev
```

## 🔑 Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
ZAPI_INSTANCE_ID=seu_instance_id
ZAPI_TOKEN=seu_token
OPENAI_API_KEY=sua_chave_openai
```

## 📡 Configurar Webhook na Z-API

1. Acesse o painel da Z-API
2. Vá em **Configurações** > **Webhook**
3. Configure:
   - **URL:** `https://seu-dominio.com/api/webhook`
   - **Método:** POST

**Para testes locais, use ngrok:**
```bash
ngrok http 3000
# Use a URL fornecida pelo ngrok no webhook
```

## ✅ Testar

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Enviar Mensagem Manual
```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"5511999999999","message":"Teste"}'
```

### 3. Ver Mensagens
```bash
curl http://localhost:3000/api/messages
```

## 📚 Documentação Completa

Veja o [README.md](README.md) para documentação completa.

## 🆘 Problemas?

Consulte [TESTING.md](TESTING.md) para soluções de problemas comuns.

