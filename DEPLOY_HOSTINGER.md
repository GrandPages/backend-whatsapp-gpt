# 🚀 Guia Completo de Deploy na Hostinger

Este documento contém todas as informações necessárias para fazer o deploy do projeto na Hostinger.

## 📋 Checklist de Configuração na Hostinger

### 1. **Porta do Servidor**
- ✅ A Hostinger geralmente fornece a porta via variável de ambiente `PORT`
- ✅ O código já está configurado para usar `process.env.PORT || 3000`
- ✅ **Ação:** Não é necessário configurar manualmente, a Hostinger define automaticamente

### 2. **Versão do Node.js**
- ✅ **Recomendado:** Node.js 18.x ou 20.x (LTS)
- ✅ **Verificar:** No painel da Hostinger, confirme a versão disponível
- ✅ **Ação:** Se necessário, solicite atualização da versão do Node.js no suporte

### 3. **Caminho do Build**
- ✅ **Caminho raiz:** `/` (raiz do projeto)
- ✅ **Ponto de entrada:** `src/server.js`
- ✅ **Ação:** Certifique-se de que todos os arquivos estão na raiz do projeto na Hostinger

### 4. **Comando de Inicialização**
- ✅ **Comando:** `npm start`
- ✅ **Alternativa:** `node src/server.js`
- ✅ **Ação:** Configure no painel da Hostinger:
  - **Start Command:** `npm start`
  - **Ou:** `node src/server.js`

### 5. **Configuração do Banco MySQL**
- ✅ **Tipo:** MySQL
- ✅ **Formato da URL:** `mysql://usuario:senha@host:3306/banco`
- ✅ **SSL:** Recomendado usar SSL (`?sslmode=REQUIRED`)
- ✅ **Ação:** 
  1. Acesse o painel da Hostinger
  2. Vá em **Banco de Dados** > **MySQL**
  3. Anote:
     - **Host:** (ex: `mysql.hostinger.com`)
     - **Usuário:** (ex: `u123456789_user`)
     - **Senha:** (sua senha)
     - **Banco:** (ex: `u123456789_db`)
     - **Porta:** (geralmente `3306`)
  4. Configure a `DATABASE_URL` no `.env` (veja formato abaixo)

### 6. **Localização do Arquivo .env**
- ✅ **Localização:** Na raiz do projeto (mesmo nível do `package.json`)
- ✅ **Ação:** 
  1. Crie o arquivo `.env` na raiz do projeto na Hostinger
  2. Use o formato fornecido abaixo
  3. **IMPORTANTE:** Não commite o `.env` no Git (já está no `.gitignore`)

### 7. **Permissões e CORS**
- ✅ **Permissões:** A Hostinger gerencia automaticamente
- ✅ **CORS:** Configurado dinamicamente via variável `CORS_ALLOWED_ORIGINS`
- ✅ **Ação:** Configure `CORS_ALLOWED_ORIGINS` no `.env` com seu domínio:
  ```
  CORS_ALLOWED_ORIGINS=https://seusite.com,https://www.seusite.com
  ```

### 8. **Prisma e Migrações**
- ✅ **Antes do deploy:** Execute localmente:
  ```bash
  npm run prisma:generate
  npm run prisma:migrate deploy
  ```
- ✅ **Ou na Hostinger:** Após fazer upload, execute via SSH:
  ```bash
  npm run prisma:generate
  npm run prisma:migrate deploy
  ```

## 🔧 Passo a Passo do Deploy

### Passo 1: Preparação Local
1. ✅ Instale todas as dependências:
   ```bash
   npm install
   ```

2. ✅ Gere o cliente Prisma:
   ```bash
   npm run prisma:generate
   ```

3. ✅ Teste localmente:
   ```bash
   npm run dev
   ```

### Passo 2: Upload para Hostinger
1. ✅ Faça upload de todos os arquivos para a Hostinger (via FTP/SFTP ou Git)
2. ✅ **NÃO faça upload do arquivo `.env`** (crie diretamente na Hostinger)
3. ✅ Certifique-se de que o `.gitignore` está funcionando

### Passo 3: Configuração na Hostinger
1. ✅ Acesse o painel da Hostinger
2. ✅ Configure o Node.js:
   - Versão: 18.x ou 20.x
   - Start Command: `npm start`
   - Root Directory: `/` (raiz do projeto)

3. ✅ Crie o arquivo `.env` na raiz do projeto com o conteúdo abaixo

4. ✅ Execute via SSH (se disponível):
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate deploy
   ```

### Passo 4: Configurar Webhook Z-API
1. ✅ Acesse o painel da Z-API
2. ✅ Configure o webhook:
   - **URL:** `https://seu-dominio.com/api/webhook`
   - **Método:** POST

### Passo 5: Testar
1. ✅ Acesse: `https://seu-dominio.com/health`
2. ✅ Deve retornar: `{"status":"ok","timestamp":"..."}`
3. ✅ Teste o webhook enviando uma mensagem via WhatsApp

## 🔐 Arquivo .env Final para Produção (Hostinger)

```env
# ============================================
# CONFIGURAÇÃO DO SERVIDOR
# ============================================
# Porta (geralmente definida automaticamente pela Hostinger)
PORT=3000

# Ambiente de execução
NODE_ENV=production

# ============================================
# CONFIGURAÇÃO DO BANCO DE DADOS MYSQL (HOSTINGER)
# ============================================
# Formato: mysql://USUARIO:SENHA@HOST:PORTA/BANCO
# 
# IMPORTANTE: Se a senha contém caracteres especiais, use URL encoding:
# @ = %40, # = %23, $ = %24, % = %25, & = %26, + = %2B, / = %2F, : = %3A, ? = %3F
#
# Exemplo COM SSL (recomendado):
# DATABASE_URL=mysql://u123456789_user:senha123@mysql.hostinger.com:3306/u123456789_db?sslmode=REQUIRED
#
# Exemplo SEM SSL (não recomendado):
# DATABASE_URL=mysql://u123456789_user:senha123@mysql.hostinger.com:3306/u123456789_db
#
# SUBSTITUA pelos seus dados reais da Hostinger:
DATABASE_URL=mysql://SEU_USUARIO:SUA_SENHA@SEU_HOST:3306/SEU_BANCO?sslmode=REQUIRED

# ============================================
# CONFIGURAÇÃO OPENAI
# ============================================
# Chave da API da OpenAI
# Obtenha em: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Modelo da OpenAI (opcional, padrão: gpt-4o)
OPENAI_MODEL=gpt-4o

# ============================================
# CONFIGURAÇÃO Z-API (WHATSAPP)
# ============================================
# ID da instância Z-API
# Obtenha no painel da Z-API: https://developer.z-api.io
ZAPI_INSTANCE_ID=seu_instance_id_aqui

# Token de autenticação Z-API
# Obtenha no painel da Z-API
ZAPI_TOKEN=seu_token_aqui

# ============================================
# CONFIGURAÇÃO CORS
# ============================================
# Origens permitidas (separadas por vírgula)
# Substitua pelo seu domínio real
CORS_ALLOWED_ORIGINS=https://seusite.com,https://www.seusite.com

# Permitir credenciais (opcional)
CORS_ALLOW_CREDENTIALS=false
```

## ⚠️ Importante: Formato DATABASE_URL para Hostinger

### Exemplo Real:
```
mysql://u123456789_user:MinhaSenh@123@mysql.hostinger.com:3306/u123456789_db?sslmode=REQUIRED
```

### Se a senha contém caracteres especiais:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`

**Exemplo com senha que contém `@`:**
```
mysql://usuario:MinhaSenh%40123@host:3306/banco?sslmode=REQUIRED
```

## ✅ Validação Final

Após configurar tudo, verifique:

1. ✅ **Variáveis obrigatórias estão definidas:**
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `ZAPI_INSTANCE_ID`
   - `ZAPI_TOKEN`

2. ✅ **Servidor inicia sem erros:**
   - Acesse: `https://seu-dominio.com/health`
   - Deve retornar status OK

3. ✅ **Banco de dados conecta:**
   - Verifique os logs do servidor
   - Deve aparecer: "✅ Banco de dados conectado com sucesso!"

4. ✅ **Webhook funciona:**
   - Envie uma mensagem via WhatsApp
   - Verifique os logs para confirmar processamento

5. ✅ **CORS está configurado:**
   - Teste requisições do seu frontend
   - Não deve haver erros de CORS

## 🐛 Solução de Problemas

### Erro: "Variáveis de ambiente não definidas"
- ✅ Verifique se o arquivo `.env` está na raiz do projeto
- ✅ Confirme que todas as variáveis obrigatórias estão preenchidas
- ✅ Verifique se não há espaços extras ou aspas desnecessárias

### Erro: "Erro ao conectar ao banco de dados"
- ✅ Verifique o formato da `DATABASE_URL`
- ✅ Confirme que as credenciais estão corretas
- ✅ Teste a conexão MySQL diretamente
- ✅ Verifique se o SSL está configurado corretamente

### Erro: "OPENAI_API_KEY não está configurada"
- ✅ Verifique se a chave está correta no `.env`
- ✅ Confirme que não há espaços ou caracteres extras
- ✅ Teste a chave diretamente na API da OpenAI

### Erro: "ZAPI_INSTANCE_ID e ZAPI_TOKEN são obrigatórias"
- ✅ Verifique se ambos estão no `.env`
- ✅ Confirme que os valores estão corretos
- ✅ Teste no painel da Z-API

### Servidor não inicia
- ✅ Verifique os logs de erro
- ✅ Confirme que o Node.js está na versão correta
- ✅ Execute `npm install` novamente
- ✅ Verifique se o arquivo `src/server.js` existe

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor na Hostinger
2. Teste localmente primeiro
3. Consulte a documentação da Hostinger
4. Entre em contato com o suporte da Hostinger se necessário

---

**Última atualização:** 2025-01-14
**Versão do projeto:** 1.0.0

