# WhatsApp AI Backend

Backend completo em Node.js (Express) que integra Z-API (WhatsApp) com OpenAI para responder automaticamente mensagens do WhatsApp usando inteligência artificial.

## 🚀 Funcionalidades

- ✅ Recebe mensagens do WhatsApp via webhook da Z-API
- ✅ Processa mensagens com GPT-4 da OpenAI
- ✅ Envia respostas automáticas via Z-API
- ✅ Armazena todas as conversas no banco de dados (SQLite)
- ✅ API REST para gerenciamento de mensagens
- ✅ Endpoint para envio manual de mensagens

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Conta na Z-API (para WhatsApp)
- Chave da API da OpenAI

## 🔧 Instalação

### Opção 1: Instalação Manual

1. **Clone o repositório ou baixe os arquivos**

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
   
   Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:
```bash
PORT=3000
ZAPI_INSTANCE_ID=seu_instance_id_aqui
ZAPI_TOKEN=seu_token_aqui
OPENAI_API_KEY=sua_openai_api_key_aqui
DATABASE_URL="file:./dev.db"
```

4. **Configure o banco de dados:**
```bash
# Gera o cliente Prisma
npm run prisma:generate

# Cria as tabelas no banco de dados
npm run prisma:migrate
```

5. **Inicie o servidor:**
```bash
npm run dev
```

### Opção 2: Script de Inicialização Automática

**Linux/Mac:**
```bash
chmod +x scripts/init.sh
./scripts/init.sh
```

**Windows:**
```bash
scripts\init.bat
```

O servidor estará rodando em `http://localhost:3000`

## 📡 Endpoints da API

### `GET /`
Retorna informações sobre a API e endpoints disponíveis.

### `POST /api/webhook`
Recebe mensagens do WhatsApp via Z-API.

**Configuração no painel da Z-API:**
- URL do webhook: `http://seu-dominio.com/api/webhook`
- Método: POST

**Formato esperado do webhook (a Z-API pode enviar em diferentes formatos):**
```json
{
  "phone": "5511999999999",
  "message": "Olá, preciso de ajuda!",
  "name": "João Silva"
}
```

Ou alternativamente:
```json
{
  "phoneNumber": "5511999999999",
  "text": "Olá, preciso de ajuda!",
  "clientName": "João Silva"
}
```

**Fluxo:**
1. Recebe a mensagem do WhatsApp
2. Extrai o número e texto da mensagem (suporta múltiplos formatos)
3. Gera resposta com GPT-4-turbo
4. Envia resposta via Z-API
5. Salva no banco de dados

**Nota:** O webhook é flexível e tenta extrair informações de diferentes campos possíveis enviados pela Z-API.

### `GET /api/messages`
Retorna todas as mensagens salvas no banco de dados.

**Query Parameters:**
- `limit` (opcional): Número máximo de mensagens (padrão: 100)
- `offset` (opcional): Número de mensagens para pular (padrão: 0)

**Exemplo:**
```bash
GET /api/messages?limit=50&offset=0
```

### `POST /api/send`
Envia uma mensagem manualmente via Z-API.

**Body:**
```json
{
  "phoneNumber": "5511999999999",
  "message": "Olá! Esta é uma mensagem de teste."
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso",
  "data": {
    "id": 1,
    "phoneNumber": "5511999999999",
    "message": "Olá! Esta é uma mensagem de teste.",
    "zapiResponse": {...}
  }
}
```

### `GET /health`
Health check do servidor.

## 🗄️ Estrutura do Banco de Dados

### Tabela: `messages`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | Integer | ID único da mensagem |
| client_name | String (nullable) | Nome do cliente |
| phone_number | String | Número do telefone |
| received_message | String | Mensagem recebida |
| sent_message | String | Mensagem enviada |
| timestamp | DateTime | Data e hora da mensagem |

## 📁 Estrutura do Projeto

```
whatsapp-ai-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do Prisma
│   ├── controllers/
│   │   └── messageController.js # Lógica de negócio
│   ├── routes/
│   │   └── messageRoutes.js     # Rotas da API
│   ├── services/
│   │   ├── zapiService.js       # Integração com Z-API
│   │   └── openaiService.js     # Integração com OpenAI
│   └── server.js                # Servidor Express
├── prisma/
│   └── schema.prisma            # Schema do banco de dados
├── .env                         # Variáveis de ambiente
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `PORT` | Porta do servidor | Não (padrão: 3000) |
| `ZAPI_INSTANCE_ID` | ID da instância Z-API | Sim |
| `ZAPI_TOKEN` | Token de autenticação Z-API | Sim |
| `OPENAI_API_KEY` | Chave da API OpenAI | Sim |
| `DATABASE_URL` | URL do banco de dados | Sim |

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com nodemon)
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:migrate` - Executa migrações do banco de dados
- `npm run prisma:studio` - Abre o Prisma Studio (interface visual do banco)

## 📝 Exemplo de Uso

### 1. Configurar Webhook na Z-API

No painel da Z-API, configure a URL do webhook:
```
http://seu-dominio.com/api/webhook
```

### 2. Enviar uma mensagem manualmente

```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "5511999999999",
    "message": "Olá! Como posso ajudar?"
  }'
```

### 3. Consultar mensagens

```bash
curl http://localhost:3000/api/messages
```

## 🐛 Solução de Problemas

### Erro ao conectar no banco de dados
- Verifique se o arquivo `.env` está configurado corretamente
- Execute `npm run prisma:migrate` para criar as tabelas

### Erro ao enviar mensagem via Z-API
- Verifique se o `ZAPI_INSTANCE_ID` e `ZAPI_TOKEN` estão corretos
- Confirme que a instância está ativa no painel da Z-API

### Erro ao gerar resposta com OpenAI
- Verifique se a `OPENAI_API_KEY` está válida
- Confirme que há créditos disponíveis na sua conta OpenAI

## 📚 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Axios** - Cliente HTTP
- **Z-API** - API do WhatsApp
- **OpenAI** - API de IA (GPT-4)

## 📄 Licença

ISC

## 🤝 Contribuindo

Sinta-se à vontade para contribuir com melhorias e correções!

## 📞 Suporte

Em caso de dúvidas ou problemas, abra uma issue no repositório.

