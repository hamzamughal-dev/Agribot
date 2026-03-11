const express = require('express');
const router = express.Router();
const { chat, healthCheck } = require('../controllers/geminiController');

// Chat endpoint
router.post('/chat', chat);

// Health check endpoint
router.get('/health', healthCheck);

module.exports = router;
