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

### 5. **Localização do Arquivo .env**
- ✅ **Localização:** Na raiz do projeto (mesmo nível do `package.json`)
- ✅ **Ação:** 
  1. Crie o arquivo `.env` na raiz do projeto na Hostinger
  2. Use o formato fornecido abaixo
  3. **IMPORTANTE:** Não commite o `.env` no Git (já está no `.gitignore`)

### 6. **Permissões e CORS**
- ✅ **Permissões:** A Hostinger gerencia automaticamente
- ✅ **CORS:** Configurado dinamicamente via variável `CORS_ALLOWED_ORIGINS`
- ✅ **Ação:** Configure `CORS_ALLOWED_ORIGINS` no `.env` com seu domínio:
  ```
  CORS_ALLOWED_ORIGINS=https://seusite.com,https://www.seusite.com
  ```

## 🔧 Passo a Passo do Deploy

### Passo 1: Preparação Local
1. ✅ Instale todas as dependências:
   ```bash
   npm install
   ```

2. ✅ Teste localmente:
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

## ✅ Validação Final

Após configurar tudo, verifique:

1. ✅ **Variáveis obrigatórias estão definidas:**
   - `OPENAI_API_KEY`
   - `ZAPI_INSTANCE_ID`
   - `ZAPI_TOKEN`

2. ✅ **Servidor inicia sem erros:**
   - Acesse: `https://seu-dominio.com/health`
   - Deve retornar status OK

3. ✅ **Webhook funciona:**
   - Envie uma mensagem via WhatsApp
   - Verifique os logs para confirmar processamento

4. ✅ **CORS está configurado:**
   - Teste requisições do seu frontend
   - Não deve haver erros de CORS

## 🐛 Solução de Problemas

### Erro: "Variáveis de ambiente não definidas"
- ✅ Verifique se o arquivo `.env` está na raiz do projeto
- ✅ Confirme que todas as variáveis obrigatórias estão preenchidas
- ✅ Verifique se não há espaços extras ou aspas desnecessárias

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

