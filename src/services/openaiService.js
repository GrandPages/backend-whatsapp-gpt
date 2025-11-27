const axios = require('axios');
const { env } = require('../config/env');

const { apiKey, apiUrl, model, timeoutMs } = env.openai;

if (!apiKey) {
  throw new Error(
    'OPENAI_API_KEY não está configurada. Defina a variável de ambiente antes de iniciar o servidor.'
  );
}

// Normaliza a URL da API - se for a URL completa, extrai apenas a base
let baseURL = apiUrl;
if (apiUrl.includes('/chat/completions')) {
  baseURL = apiUrl.replace('/chat/completions', '');
}

const openaiClient = axios.create({
  baseURL: baseURL,
  timeout: timeoutMs,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Gera uma resposta usando o modelo GPT-4 da OpenAI
 * @param {string} userMessage - Mensagem recebida do usuário
 * @param {string} clientName - Nome do cliente (opcional)
 * @returns {Promise<string>} Resposta gerada pela IA
 */
async function generateResponse(userMessage, clientName = null) {
  try {
    console.log('🤖 Iniciando chamada para OpenAI...');
    console.log(`   Modelo: ${model}`);
    console.log(`   Mensagem do usuário: ${userMessage.substring(0, 100)}${userMessage.length > 100 ? '...' : ''}`);
    
    const systemPrompt = `Você é um assistente virtual inteligente e prestativo. 
Responda de forma clara, concisa e amigável. 
Seja útil e profissional em todas as interações.`;

    const userPrompt = clientName 
      ? `${clientName} disse: ${userMessage}`
      : userMessage;

    const requestPayload = {
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    };

    console.log('📤 Enviando requisição para OpenAI...');
    const response = await openaiClient.post('/chat/completions', requestPayload);

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Resposta inválida da OpenAI');
    }

    const aiResponse = response.data.choices[0].message.content;
    
    // Log detalhado da resposta
    console.log('✅ Resposta recebida da OpenAI:');
    console.log(`   Tokens usados: ${response.data.usage?.total_tokens || 'N/A'}`);
    console.log(`   Resposta: ${aiResponse.substring(0, 200)}${aiResponse.length > 200 ? '...' : ''}`);
    
    return aiResponse.trim();
  } catch (error) {
    console.error('❌ ERRO ao gerar resposta com OpenAI:');
    console.error(`   Mensagem: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    if (error.request) {
      console.error(`   Request feito mas sem resposta`);
    }
    console.error(`   Stack: ${error.stack}`);
    
    // Retorna uma mensagem padrão em caso de erro
    throw error; // Lança o erro para que o chamador possa tratá-lo
  }
}

module.exports = {
  generateResponse
};

