const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    conversationTitle: {
        type: String,
        default: 'New Conversation'
    },
    userMessage: {
        type: String,
        required: true
    },
    aiResponse: {
        type: String,
        required: true
    },
    tokens: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index for faster queries
chatMessageSchema.index({ userId: 1, conversationId: 1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
