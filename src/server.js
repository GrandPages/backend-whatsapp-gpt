// CRÍTICO: Carrega dotenv ANTES de qualquer outro import
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { env, validateEnv } = require('./config/env');
const messageRoutes = require('./routes/messageRoutes');
const { sendTextMessage } = require('./services/zapiService');

validateEnv();

const app = express();
const PORT = env.port;

function buildCorsOptions() {
  const { allowedOrigins, allowCredentials, allowedHeaders, allowedMethods } =
    env.cors;

  if (allowedOrigins === '*') {
    return {
      origin: true,
      credentials: allowCredentials,
      methods: allowedMethods,
      allowedHeaders,
    };
  }

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`🚫 Origem não autorizada pelo CORS: ${origin}`);
      return callback(new Error('Origem não permitida pelo CORS'));
    },
    credentials: allowCredentials,
    methods: allowedMethods,
    allowedHeaders,
  };
}

const corsOptions = buildCorsOptions();

// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotas
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp AI Backend - API em funcionamento!',
    version: '1.0.0',
    endpoints: {
      webhook: 'POST /webhook',
      messages: 'GET /messages',
      send: 'POST /send'
    }
  });
});

// Endpoint POST /gancho - Webhook do WhatsApp via Z-API
app.post('/gancho', async (req, res) => {
  const timestamp = new Date().toISOString();
  const horaFormatada = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  
  try {
    // Log do body completo recebido
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`📥 WEBHOOK RECEBIDO - ${horaFormatada}`);
    console.log(`⏰ Timestamp: ${timestamp}`);
    console.log('📦 Body completo recebido:');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('═══════════════════════════════════════════════════════════\n');

    // Extrai dados do webhook da Z-API
    const body = req.body || {};
    
    // Tenta extrair o número de telefone (vários formatos possíveis)
    const phone = body.phone || body.phoneNumber || body.from || body.number || 
                  body.senderPhone || body.phoneSender || null;
    
    // Tenta extrair o texto da mensagem (vários formatos possíveis)
    let messageText = null;

    // Formato 1: body.message (string direta)
    if (typeof body.message === 'string') {
      messageText = body.message;
    }
    // Formato 2: body.message.text
    else if (body.message && typeof body.message.text === 'string') {
      messageText = body.message.text;
    }
    // Formato 3: body.text (string direta)
    else if (typeof body.text === 'string') {
      messageText = body.text;
    }
    // Formato 4: body.text.message (formato usado pela Z-API no meu payload)
    else if (body.text && typeof body.text.message === 'string') {
      messageText = body.text.message;
    }
    // Formato 5: body.body
    else if (body.body) {
      messageText = body.body;
    }
    // Formato 6: body.messageText
    else if (body.messageText) {
      messageText = body.messageText;
    }
    // Formato 7: body.content
    else if (body.content) {
      messageText = body.content;
    }

    if (typeof messageText !== 'string') {
      console.log("❌ Nenhum texto de mensagem encontrado.");
      return res.sendStatus(200);
    }

    messageText = messageText.trim();
    console.log("📩 Texto detectado:", messageText);

    // Verifica se é uma mensagem de texto válida
    if (!phone || !messageText || messageText === '') {
      console.warn('⚠️  AVISO: Webhook recebido mas sem mensagem de texto válida');
      console.warn(`   Phone: ${phone || 'NÃO ENCONTRADO'}`);
      console.warn(`   Texto: ${messageText || 'NÃO ENCONTRADO'}`);
      console.warn('   Retornando 200 para não travar a Z-API\n');
      
      return res.status(200).json({ 
        status: "ok",
        message: "Webhook recebido mas sem mensagem de texto válida para processar"
      });
    }

    // Remove caracteres especiais do número (deixa apenas dígitos)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Log da mensagem detectada
    console.log(`📨 MENSAGEM DETECTADA:`);
    console.log(`   De: ${cleanPhone}`);
    console.log(`   Texto: ${messageText}`);
    console.log('');

    // Envia resposta automática via Z-API
    try {
      const respostaAutomatica = `Olá! Recebi sua mensagem: "${messageText}". Esta é uma resposta automática do webhook.`;
      
      console.log(`📤 Enviando resposta automática para ${cleanPhone}...`);
      await sendTextMessage(cleanPhone, respostaAutomatica);
      console.log(`✅ Resposta enviada com sucesso!\n`);
      
    } catch (errorEnvio) {
      console.error('❌ ERRO ao enviar resposta via Z-API:');
      console.error(`   ${errorEnvio.message}`);
      if (errorEnvio.response) {
        console.error(`   Status: ${errorEnvio.response.status}`);
        console.error(`   Data: ${JSON.stringify(errorEnvio.response.data)}`);
      }
      console.error('');
      // Não lança erro - continua e retorna 200 para não travar o webhook
    }

    // Sempre retorna 200 para a Z-API não travar
    return res.status(200).json({ 
      status: "ok",
      message: "Webhook processado com sucesso",
      data: {
        phone: cleanPhone,
        receivedMessage: messageText,
        timestamp
      }
    });

  } catch (error) {
    // Captura qualquer erro não tratado
    console.error('❌ ERRO CRÍTICO no webhook:');
    console.error(`   ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    console.error('');
    
    // SEMPRE retorna 200 mesmo em caso de erro para não travar a Z-API
    return res.status(200).json({ 
      status: "ok",
      message: "Webhook recebido (erro interno tratado)",
      error: error.message
    });
  }
});

app.use('/api', messageRoutes);

// Rota de ping para testes simples
app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Inicializa o servidor
function startServer() {
  // Inicia o servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌎 Ambiente: ${env.nodeEnv}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📡 Webhook: http://localhost:${PORT}/api/webhook`);
    console.log(`🎣 Gancho Z-API: http://localhost:${PORT}/gancho`);
    console.log(`📋 Mensagens: http://localhost:${PORT}/api/messages`);
    console.log(`✉️  Enviar: http://localhost:${PORT}/api/send`);
    console.log(`💓 Health Check: http://localhost:${PORT}/health`);
    console.log(`🏓 Ping: http://localhost:${PORT}/ping`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando servidor...');
  process.exit(0);
});

// Inicia o servidor
startServer();

module.exports = app;

