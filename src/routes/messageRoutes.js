const express = require('express');
const router = express.Router();
const {
  handleWebhook,
  getMessages,
  sendMessage
} = require('../controllers/messageController');

// POST /webhook - Recebe mensagens do WhatsApp via Z-API
router.post('/webhook', handleWebhook);

// GET /messages - Retorna todas as mensagens salvas
router.get('/messages', getMessages);

// POST /send - Envia uma mensagem manualmente
router.post('/send', sendMessage);

module.exports = router;

