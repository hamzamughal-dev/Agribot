const OpenAI = require('openai');
const ChatMessage = require('../models/chatMessageModel');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// System prompt for agricultural context
const AGRICULTURE_SYSTEM_PROMPT = `You are an expert Agricultural AI Assistant with deep knowledge in:
- Crop management and farming techniques
- Plant diseases and pest control
- Soil health and fertilization
- Irrigation and water management
- Sustainable and organic farming practices
- Agricultural technology and innovations
- Weather patterns and their impact on agriculture
- Animal husbandry and livestock management

Provide accurate, helpful, and practical advice to farmers and agricultural enthusiasts. 
When answering questions:
1. Be specific and actionable
2. Consider local farming conditions when possible
3. Prioritize sustainable and safe practices
4. Provide step-by-step guidance when appropriate
5. Be friendly and encouraging`;

// Chat with OpenAI
exports.chat = async (req, res) => {
    try {
        const { message, conversationHistory = [], conversationId, userId } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid message'
            });
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not set in environment variables');
            return res.status(500).json({
                success: false,
                error: 'AI service is not configured properly'
            });
        }

        // Build messages array with system prompt and history
        const messages = [
            {
                role: 'system',
                content: AGRICULTURE_SYSTEM_PROMPT
            }
        ];

        // Add conversation history
        conversationHistory.forEach(msg => {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        });

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 2048,
            top_p: 0.95
        });

        const aiResponseText = response.choices[0].message.content;

        // Save to database if userId and conversationId are provided
        if (userId && conversationId) {
            try {
                const mongoose = require('mongoose');
                let userObjectId;
                
                try {
                    userObjectId = new mongoose.Types.ObjectId(userId);
                } catch (err) {
                    console.error('Invalid userId format:', userId);
                    // Still send response even if save fails
                }

                if (userObjectId) {
                    const savedMessage = await ChatMessage.create({
                        userId: userObjectId,
                        conversationId,
                        conversationTitle: conversationHistory.length === 0 ? message.substring(0, 50) : undefined,
                        userMessage: message,
                        aiResponse: aiResponseText,
                        tokens: response.usage.total_tokens
                    });
                    console.log('Chat message saved successfully:', savedMessage._id);
                }
            } catch (dbError) {
                console.error('Error saving chat message to database:', dbError.message);
                // Don't fail the request if database save fails
            }
        } else {
            console.warn('userId or conversationId missing:', { userId, conversationId });
        }

        // Update conversation history
        const updatedHistory = [
            ...conversationHistory,
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponseText }
        ];

        // Keep only last 20 messages (10 exchanges) to manage context length
        const trimmedHistory = updatedHistory.slice(-20);

        res.status(200).json({
            success: true,
            response: aiResponseText,
            conversationHistory: trimmedHistory
        });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        let errorMessage = 'An error occurred while processing your request';
        let statusCode = 500;

        if (error.message?.includes('API key') || error.status === 401) {
            errorMessage = 'Invalid API key configuration';
            statusCode = 500;
        } else if (error.status === 429) {
            errorMessage = 'API quota exceeded. Please try again later.';
            statusCode = 429;
        } else if (error.message?.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.';
            statusCode = 408;
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Health check for OpenAI API
exports.healthCheck = async (req, res) => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.error('API key is missing');
            return res.status(500).json({
                success: false,
                message: 'OpenAI API key is not configured'
            });
        }

        // Try a simple test request
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: 'Hello'
                }
            ],
            max_tokens: 5
        });

        const testResponse = response.choices[0].message.content;
        
        res.status(200).json({
            success: true,
            message: 'OpenAI API is working correctly',
            model: 'gpt-4o-mini',
            testResponse: testResponse.substring(0, 100)
        });
    } catch (error) {
        console.error('OpenAI Health Check Error:', error);
        
        res.status(500).json({
            success: false,
            message: 'OpenAI API is not accessible',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const mongoose = require('mongoose');
        let userObjectId;
        
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
        } catch (err) {
            return res.status(400).json({
                success: false,
                error: 'Invalid userId format'
            });
        }

        // Get unique conversations with latest message
        const conversations = await ChatMessage.aggregate([
            { $match: { userId: userObjectId } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$conversationId',
                    conversationTitle: { $first: '$conversationTitle' },
                    lastUserMessage: { $first: '$userMessage' },
                    lastAiResponse: { $first: '$aiResponse' },
                    latestTime: { $first: '$createdAt' },
                    messageCount: { $sum: 1 }
                }
            },
            { $sort: { latestTime: -1 } }
        ]);

        console.log(`Fetched ${conversations.length} conversations for user ${userId}`);

        res.status(200).json({
            success: true,
            conversations: conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversations',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get specific conversation
exports.getConversationById = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const mongoose = require('mongoose');
        let userObjectId;
        
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
        } catch (err) {
            return res.status(400).json({
                success: false,
                error: 'Invalid userId format'
            });
        }

        const messages = await ChatMessage.find({
            conversationId,
            userId: userObjectId
        }).sort({ createdAt: 1 });

        if (messages.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.status(200).json({
            success: true,
            messages: messages
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversation',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete conversation
exports.deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        const mongoose = require('mongoose');
        let userObjectId;
        
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
        } catch (err) {
            return res.status(400).json({
                success: false,
                error: 'Invalid userId format'
            });
        }

        const result = await ChatMessage.deleteMany({
            conversationId,
            userId: userObjectId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete conversation',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update conversation title
exports.updateConversationTitle = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { title } = req.body;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required'
            });
        }

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'title is required and must be a non-empty string'
            });
        }

        const mongoose = require('mongoose');
        let userObjectId;
        
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
        } catch (err) {
            return res.status(400).json({
                success: false,
                error: 'Invalid userId format'
            });
        }

        const result = await ChatMessage.updateMany(
            {
                conversationId,
                userId: userObjectId
            },
            {
                $set: { conversationTitle: title.trim() }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Conversation title updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error updating conversation title:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update conversation title',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
