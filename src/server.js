// CRÍTICO: Carrega dotenv ANTES de qualquer outro import
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { env, validateEnv } = require('./config/env');
const { connectDB, disconnectDB } = require('./config/database');
const messageRoutes = require('./routes/messageRoutes');

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
async function startServer() {
  try {
    // Conecta ao banco de dados
    await connectDB();

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌎 Ambiente: ${env.nodeEnv}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📡 Webhook: http://localhost:${PORT}/api/webhook`);
      console.log(`📋 Mensagens: http://localhost:${PORT}/api/messages`);
      console.log(`✉️  Enviar: http://localhost:${PORT}/api/send`);
      console.log(`💓 Health Check: http://localhost:${PORT}/health`);
      console.log(`🏓 Ping: http://localhost:${PORT}/ping`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await disconnectDB();
  process.exit(0);
});

// Inicia o servidor
startServer();

module.exports = app;

