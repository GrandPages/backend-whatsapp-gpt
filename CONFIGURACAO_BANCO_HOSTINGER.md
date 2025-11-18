# 🗄️ Configuração do Banco de Dados na Hostinger

## ✅ Resposta Rápida

**SIM**, você precisa de banco de dados MySQL na Hostinger.

**NÃO**, você **NÃO precisa importar nenhum arquivo SQL manualmente**. O Prisma cria todas as tabelas automaticamente!

## 📋 Passo a Passo Completo

### 1️⃣ Criar o Banco MySQL na Hostinger

1. Acesse o painel da Hostinger
2. Vá em **Banco de Dados** > **MySQL**
3. Se ainda não criou o banco, crie um novo banco MySQL
4. Anote as seguintes informações:
   - **Host:** (ex: `mysql.hostinger.com`)
   - **Usuário:** (ex: `u123456789_user`)
   - **Senha:** (sua senha)
   - **Nome do Banco:** (ex: `u123456789_db`)
   - **Porta:** (geralmente `3306`)

### 2️⃣ Configurar a DATABASE_URL no .env

Edite o arquivo `.env` na raiz do projeto na Hostinger e configure a `DATABASE_URL`:

```env
DATABASE_URL=mysql://SEU_USUARIO:SUA_SENHA@SEU_HOST:3306/SEU_BANCO?sslmode=REQUIRED
```

**Exemplo real:**
```env
DATABASE_URL=mysql://u123456789_user:MinhaSenh@123@mysql.hostinger.com:3306/u123456789_db?sslmode=REQUIRED
```

**⚠️ IMPORTANTE:** Se sua senha contém caracteres especiais, use URL encoding:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`

### 3️⃣ Criar as Tabelas Automaticamente (via Prisma)

**Você NÃO precisa criar as tabelas manualmente!** O Prisma faz isso para você.

Após fazer o upload do projeto para a Hostinger, execute via **SSH** (ou terminal da Hostinger):

```bash
# 1. Instalar dependências (se ainda não fez)
npm install

# 2. Gerar o cliente Prisma
npm run prisma:generate

# 3. Criar as tabelas no banco de dados (MIGRAÇÕES)
npm run prisma:migrate
```

**Ou, se estiver em produção:**
```bash
npm run prisma:generate
npx prisma migrate deploy
```

### 4️⃣ Verificar se Funcionou

Após executar as migrações, você deve ver uma mensagem de sucesso. As tabelas serão criadas automaticamente:

- ✅ Tabela `messages` será criada com os campos:
  - `id` (auto-incremento)
  - `client_name` (texto opcional)
  - `phone_number` (texto)
  - `received_message` (texto)
  - `sent_message` (texto)
  - `timestamp` (data/hora)

### 5️⃣ Testar a Conexão

Inicie o servidor:
```bash
npm start
```

Nos logs, você deve ver:
```
✅ Banco de dados conectado com sucesso!
```

## 🎯 Resumo - O Que Você Precisa Fazer

| Passo | O Que Fazer | Como Fazer |
|-------|-------------|------------|
| 1 | Criar banco MySQL na Hostinger | Painel da Hostinger > Banco de Dados |
| 2 | Configurar DATABASE_URL no .env | Editar arquivo `.env` com suas credenciais |
| 3 | Instalar dependências | `npm install` |
| 4 | Gerar cliente Prisma | `npm run prisma:generate` |
| 5 | Criar tabelas (migrações) | `npm run prisma:migrate` |
| 6 | Iniciar servidor | `npm start` |

## ❌ O Que Você NÃO Precisa Fazer

- ❌ **NÃO precisa importar arquivo .sql**
- ❌ **NÃO precisa criar tabelas manualmente**
- ❌ **NÃO precisa executar comandos SQL manualmente**
- ❌ **NÃO precisa criar o schema manualmente**

O Prisma faz **TUDO automaticamente** através das migrações!

## 🔍 Estrutura da Tabela (Para Referência)

A tabela `messages` será criada automaticamente com esta estrutura:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (auto-incremento) | ID único da mensagem |
| client_name | VARCHAR (nullable) | Nome do cliente |
| phone_number | VARCHAR | Número do telefone |
| received_message | TEXT | Mensagem recebida |
| sent_message | TEXT | Mensagem enviada |
| timestamp | DATETIME | Data/hora (automático) |

## 🐛 Problemas Comuns

### Erro: "Table already exists"
- Isso significa que as tabelas já foram criadas
- Tudo certo, pode continuar!

### Erro: "Can't reach database server"
- Verifique se a `DATABASE_URL` está correta
- Confirme que o banco MySQL está ativo na Hostinger
- Teste a conexão diretamente no painel da Hostinger

### Erro: "Access denied"
- Verifique usuário e senha na `DATABASE_URL`
- Confirme que o usuário tem permissões no banco

### Erro: "SSL connection required"
- Adicione `?sslmode=REQUIRED` no final da `DATABASE_URL`
- Ou remova se o SSL não for necessário

## 📚 Arquivos Relacionados

- **Schema do banco:** `prisma/schema.prisma`
- **Configuração:** `src/config/database.js`
- **Documentação completa:** `DEPLOY_HOSTINGER.md`

---

**Última atualização:** 2025-01-14

