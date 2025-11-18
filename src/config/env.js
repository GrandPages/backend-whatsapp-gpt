const path = require('path');
const dotenv = require('dotenv');

// Carrega variáveis do arquivo .env para process.env
// Nota: dotenv já foi carregado no server.js, mas mantemos aqui como fallback
const envFilePath = process.env.ENV_PATH
  ? path.resolve(process.cwd(), process.env.ENV_PATH)
  : path.resolve(process.cwd(), '.env');

// Só tenta carregar se ainda não foi carregado (evita duplicação)
if (!process.env.DOTENV_LOADED) {
  const dotenvResult = dotenv.config({ path: envFilePath });
  
  if (dotenvResult.error && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Arquivo .env não encontrado. Certifique-se de definir as variáveis de ambiente no ambiente de execução.');
  }
  
  // Marca como carregado para evitar recarregamento
  process.env.DOTENV_LOADED = 'true';
}

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'OPENAI_API_KEY',
  'ZAPI_INSTANCE_ID',
  'ZAPI_TOKEN',
];

function validateEnv(customRequired) {
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    console.warn('⚠️  Validação de variáveis de ambiente ignorada por SKIP_ENV_VALIDATION=true.');
    return;
  }

  const required = customRequired || REQUIRED_ENV_VARS;
  const missing = required.filter((name) => {
    const value = process.env[name];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente não definidas: ${missing.join(', ')}`
    );
  }
}

function parseCorsOrigins() {
  const rawOrigins = process.env.CORS_ALLOWED_ORIGINS;

  if (!rawOrigins || rawOrigins.trim() === '') {
    return '*';
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  return ['true', '1', 'yes', 'y'].includes(String(value).toLowerCase());
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  cors: {
    allowedOrigins: parseCorsOrigins(),
    allowCredentials: parseBoolean(process.env.CORS_ALLOW_CREDENTIALS, false),
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS
      ? process.env.CORS_ALLOWED_HEADERS.split(',').map((header) => header.trim())
      : ['Content-Type', 'Authorization'],
    allowedMethods: process.env.CORS_ALLOWED_METHODS
      ? process.env.CORS_ALLOWED_METHODS.split(',').map((method) => method.trim().toUpperCase())
      : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    apiUrl:
      process.env.OPENAI_API_URL ||
      'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS) || 60000,
  },
  zapi: {
    baseUrl: process.env.ZAPI_BASE_URL || 'https://api.z-api.io',
    instanceId: process.env.ZAPI_INSTANCE_ID,
    token: process.env.ZAPI_TOKEN,
    timeoutMs: Number(process.env.ZAPI_TIMEOUT_MS) || 60000,
  },
};

module.exports = {
  env,
  validateEnv,
  REQUIRED_ENV_VARS,
};


