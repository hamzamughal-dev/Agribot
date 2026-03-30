const express = require('express');
const router = express.Router();
const { chat, healthCheck, getConversations, getConversationById, deleteConversation, updateConversationTitle } = require('../controllers/openaiController');

// Chat endpoint
router.post('/chat', chat);

// Health check endpoint
router.get('/health', healthCheck);

// Conversation endpoints
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId', getConversationById);
router.delete('/conversations/:conversationId', deleteConversation);
router.put('/conversations/:conversationId/title', updateConversationTitle);

module.exports = router;
