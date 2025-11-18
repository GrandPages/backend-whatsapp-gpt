const { PrismaClient } = require('@prisma/client');
const { env } = require('./env');

const prismaOptions = {
  log:
    env.nodeEnv === 'production'
      ? ['warn', 'error']
      : ['query', 'info', 'warn', 'error'],
};

if (env.databaseUrl) {
  prismaOptions.datasources = {
    db: {
      url: env.databaseUrl,
    },
  };
}

const prisma = new PrismaClient(prismaOptions);

let isConnected = false;

// Função para conectar ao banco de dados
async function connectDB() {
  try {
    if (!env.databaseUrl) {
      throw new Error(
        'DATABASE_URL não está definida. Configure a conexão com o banco de dados.'
      );
    }

    if (isConnected) {
      return;
    }

    await prisma.$connect();
    console.log('✅ Banco de dados conectado com sucesso!');
    isConnected = true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

// Função para desconectar do banco de dados
async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  await prisma.$disconnect();
  isConnected = false;
}

module.exports = { prisma, connectDB, disconnectDB };

