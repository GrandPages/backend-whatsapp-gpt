const axios = require('axios');
const { env } = require('../config/env');

const { apiKey, apiUrl, model, timeoutMs } = env.openai;

if (!apiKey) {
  throw new Error(
    'OPENAI_API_KEY não está configurada. Defina a variável de ambiente antes de iniciar o servidor.'
  );
}

const openaiClient = axios.create({
  baseURL: apiUrl,
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
    const systemPrompt = `Você é um assistente virtual inteligente e prestativo. 
Responda de forma clara, concisa e amigável. 
Seja útil e profissional em todas as interações.`;

    const userPrompt = clientName 
      ? `${clientName} disse: ${userMessage}`
      : userMessage;

    const response = await openaiClient.post('', {
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
    });

    const aiResponse = response.data.choices[0].message.content;
    console.log(`🤖 Resposta gerada pela OpenAI:`, aiResponse);
    
    return aiResponse.trim();
  } catch (error) {
    console.error('❌ Erro ao gerar resposta com OpenAI:', error.response?.data || error.message);
    
    // Retorna uma mensagem padrão em caso de erro
    return 'Desculpe, não consegui processar sua mensagem no momento. Por favor, tente novamente mais tarde.';
  }
}

module.exports = {
  generateResponse
};

