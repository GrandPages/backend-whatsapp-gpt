const axios = require('axios');
const { env } = require('../config/env');

const { baseUrl, instanceId, token, timeoutMs } = env.zapi;

if (!instanceId || !token) {
  throw new Error(
    'Variáveis ZAPI_INSTANCE_ID e (ZAPI_API_KEY ou ZAPI_TOKEN) são obrigatórias. Configure o arquivo .env antes de iniciar.'
  );
}

const zapiClient = axios.create({
  baseURL: baseUrl,
  timeout: timeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Envia uma mensagem via Z-API
 * @param {string} phoneNumber - Número do telefone (com código do país, ex: 5511999999999)
 * @param {string} message - Texto da mensagem a ser enviada
 * @returns {Promise<Object>} Resposta da API Z-API
 */
async function sendMessage(phoneNumber, message) {
  try {
    const url = `/instances/${instanceId}/token/${token}/send-text`;

    const response = await zapiClient.post(url, {
      phone: phoneNumber,
      message,
    });

    console.log(`📤 Mensagem enviada para ${phoneNumber}:`, message);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem via Z-API:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Envia uma mensagem de texto simples
 * @param {string} phoneNumber - Número do telefone
 * @param {string} message - Texto da mensagem
 * @returns {Promise<Object>} Resposta da API
 */
async function sendTextMessage(phoneNumber, message) {
  return await sendMessage(phoneNumber, message);
}

module.exports = {
  sendMessage,
  sendTextMessage
};

