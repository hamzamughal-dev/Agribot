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

// Chat with Gemini using REST API
exports.chat = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid message'
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set in environment variables');
            return res.status(500).json({
                success: false,
                error: 'AI service is not configured properly'
            });
        }

        // Build conversation context with system prompt and history
        const contents = [
            {
                role: 'user',
                parts: [{ text: AGRICULTURE_SYSTEM_PROMPT }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood. I am an expert Agricultural AI Assistant ready to help with all farming and agriculture-related questions. How can I assist you today?' }]
            }
        ];

        // Add conversation history
        conversationHistory.forEach(msg => {
            contents.push({
                role: msg.role,
                parts: [{ text: msg.content }]
            });
        });

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Call Gemini API using fetch
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to get response from Gemini');
        }

        const data = await response.json();
        
        // Extract the response text
        const aiResponseText = data.candidates[0].content.parts[0].text;

        // Update conversation history
        const updatedHistory = [
            ...conversationHistory,
            { role: 'user', content: message },
            { role: 'model', content: aiResponseText }
        ];

        // Keep only last 20 messages (10 exchanges) to manage context length
        const trimmedHistory = updatedHistory.slice(-20);

        res.status(200).json({
            success: true,
            response: aiResponseText,
            conversationHistory: trimmedHistory
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        let errorMessage = 'An error occurred while processing your request';
        let statusCode = 500;

        if (error.message?.includes('API key')) {
            errorMessage = 'Invalid API key configuration';
            statusCode = 500;
        } else if (error.message?.includes('quota')) {
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
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Health check for Gemini API
exports.healthCheck = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error('API key is missing');
            return res.status(500).json({
                success: false,
                message: 'Gemini API key is not configured'
            });
        }

        // Try a simple test request using fetch
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: 'Hello'
                                }
                            ]
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        const testResponse = data.candidates[0].content.parts[0].text;
        
        res.status(200).json({
            success: true,
            message: 'Gemini API is working correctly',
            model: 'gemini-flash-latest',
            testResponse: testResponse.substring(0, 100)
        });
    } catch (error) {
        console.error('Gemini Health Check Error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({
            success: false,
            message: 'Gemini API is not accessible',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
