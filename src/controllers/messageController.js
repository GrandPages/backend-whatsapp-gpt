const { prisma } = require('../config/database');
const { generateResponse } = require('../services/openaiService');
const { sendTextMessage } = require('../services/zapiService');

/**
 * Processa mensagens recebidas do webhook da Z-API
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function handleWebhook(req, res) {
  try {
    console.log('📥 Webhook recebido:', JSON.stringify(req.body, null, 2));

    const webhookData = req.body;
    
    // Extrai informações da mensagem (formato pode variar conforme Z-API)
    // A Z-API pode enviar mensagens em diferentes formatos:
    // - Formato 1: { phone, message, name }
    // - Formato 2: { phoneNumber, text, clientName }
    // - Formato 3: { from, body, profileName }
    // - Formato 4: { phone, messageText, senderName }
    // - Formato 5: { data: { phone, message, name } }
    
    let phoneNumber, receivedMessage, clientName;
    
    // Verifica se os dados estão dentro de um objeto 'data'
    const data = webhookData.data || webhookData;
    
    // Tenta extrair o número de telefone
    phoneNumber = data.phone || data.phoneNumber || data.from || data.number || 
                  data.senderPhone || data.phoneSender || null;
    
    // Tenta extrair a mensagem
    receivedMessage = data.message || data.text || data.body || data.messageText || 
                      data.content || data.messageContent || '';
    
    // Tenta extrair o nome do cliente
    clientName = data.name || data.clientName || data.profileName || data.senderName || 
                 data.contactName || data.nameContact || null;

    // Se ainda não encontrou, tenta em nível raiz
    if (!phoneNumber) {
      phoneNumber = webhookData.phone || webhookData.phoneNumber || webhookData.from;
    }
    if (!receivedMessage) {
      receivedMessage = webhookData.message || webhookData.text || webhookData.body || '';
    }
    if (!clientName) {
      clientName = webhookData.name || webhookData.clientName || webhookData.profileName || null;
    }

    // Validação: verifica se é uma mensagem válida (não eventos de status, etc)
    if (data.type && !['text', 'message', 'chat'].includes(data.type.toLowerCase())) {
      console.log('⚠️ Tipo de evento não é mensagem:', data.type);
      return res.status(200).json({ 
        success: true, 
        message: 'Evento ignorado (não é mensagem de texto)' 
      });
    }

    if (!phoneNumber || !receivedMessage || receivedMessage.trim() === '') {
      console.warn('⚠️ Mensagem recebida sem número ou texto válido:', webhookData);
      return res.status(200).json({ 
        success: true,
        message: 'Webhook recebido mas sem mensagem válida para processar' 
      });
    }

    // Remove caracteres especiais do número (deixa apenas dígitos)
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    console.log(`📨 Mensagem de ${clientName || cleanPhoneNumber}: ${receivedMessage}`);

    // Gera resposta usando OpenAI
    const aiResponse = await generateResponse(receivedMessage, clientName);

    // Envia resposta via Z-API
    await sendTextMessage(cleanPhoneNumber, aiResponse);

    // Salva no banco de dados
    const savedMessage = await prisma.message.create({
      data: {
        client_name: clientName,
        phone_number: cleanPhoneNumber,
        received_message: receivedMessage,
        sent_message: aiResponse,
        timestamp: new Date()
      }
    });

    console.log(`💾 Mensagem salva no banco de dados com ID: ${savedMessage.id}`);

    res.status(200).json({
      success: true,
      message: 'Mensagem processada com sucesso',
      data: {
        id: savedMessage.id,
        phoneNumber: cleanPhoneNumber,
        receivedMessage,
        sentMessage: aiResponse
      }
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}

/**
 * Retorna todas as mensagens salvas no banco de dados
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function getMessages(req, res) {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const messages = await prisma.message.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: {
        timestamp: 'desc'
      }
    });

    const total = await prisma.message.count();

    res.status(200).json({
      success: true,
      data: {
        messages,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar mensagens:', error);
    res.status(500).json({
      error: 'Erro ao buscar mensagens',
      message: error.message
    });
  }
}

/**
 * Envia uma mensagem manualmente via Z-API
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
async function sendMessage(req, res) {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'phoneNumber e message são obrigatórios'
      });
    }

    // Remove caracteres especiais do número
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Envia mensagem via Z-API
    const zapiResponse = await sendTextMessage(cleanPhoneNumber, message);

    // Salva no banco de dados (mensagem enviada manualmente)
    const savedMessage = await prisma.message.create({
      data: {
        client_name: null,
        phone_number: cleanPhoneNumber,
        received_message: '[Mensagem enviada manualmente]',
        sent_message: message,
        timestamp: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: {
        id: savedMessage.id,
        phoneNumber: cleanPhoneNumber,
        message,
        zapiResponse
      }
    });

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    res.status(500).json({
      error: 'Erro ao enviar mensagem',
      message: error.message
    });
  }
}

module.exports = {
  handleWebhook,
  getMessages,
  sendMessage
};

