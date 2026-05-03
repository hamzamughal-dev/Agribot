import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const OPENAI_API_ENDPOINT = `${API_BASE_URL}/openai/chat`;
const CONVERSATIONS_ENDPOINT = `${API_BASE_URL}/openai/conversations`;

// Generate UUID for conversation
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const AIAssistant = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '👋 Hello! I\'m your Agricultural AI Assistant. I can help you with:\n\n• **Plant Disease Diagnosis** - Identify and treat crop diseases\n• **Crop Management** - Best practices for different crops\n• **Farming Techniques** - Modern and traditional methods\n• **Pest Control** - Natural and chemical solutions\n• **Soil & Fertilizers** - Soil health and nutrition\n• **Weather & Irrigation** - Water management tips\n\nFeel free to ask me anything about agriculture!',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [conversationName, setConversationName] = useState('');
  const [isFirstMessage, setIsFirstMessage] = useState(false);
  const [renameConvId, setRenameConvId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize conversation on mount
  useEffect(() => {
    // Generate new conversation ID
    setConversationId(generateUUID());
    
    // Get userId from user prop or localStorage
    if (user && user._id) {
      console.log('User logged in, userId:', user._id);
      setUserId(user._id);
      fetchConversations(user._id);
    } else {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        console.log('Using stored userId:', storedUserId);
        setUserId(storedUserId);
        fetchConversations(storedUserId);
      } else {
        console.warn('No userId found');
      }
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus textarea on component mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const fetchConversations = async (uid) => {
    try {
      console.log('Fetching conversations for userId:', uid);
      const response = await axios.get(CONVERSATIONS_ENDPOINT, {
        params: { userId: uid }
      });
      console.log('Conversations response:', response.data);
      if (response.data.success) {
        console.log('Loaded conversations:', response.data.conversations.length);
        setConversations(response.data.conversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err.response?.data || err.message);
    }
  };

  const handleLoadConversation = async (convId) => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`${CONVERSATIONS_ENDPOINT}/${convId}`, {
        params: { userId }
      });
      
      if (response.data.success) {
        const loadedMessages = [
          {
            id: 0,
            type: 'assistant',
            content: 'Loaded previous conversation',
            timestamp: new Date().toISOString()
          }
        ];
        
        const loadedHistory = [];
        let messageId = 1;
        
        response.data.messages.forEach((msg) => {
          loadedMessages.push({
            id: messageId++,
            type: 'user',
            content: msg.userMessage,
            timestamp: msg.createdAt
          });
          loadedHistory.push({
            role: 'user',
            content: msg.userMessage
          });
          
          loadedMessages.push({
            id: messageId++,
            type: 'assistant',
            content: msg.aiResponse,
            timestamp: msg.createdAt
          });
          loadedHistory.push({
            role: 'assistant',
            content: msg.aiResponse
          });
        });
        
        setMessages(loadedMessages);
        setConversationHistory(loadedHistory);
        setConversationId(convId);
        setShowHistoryPanel(false);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  };

  const handleDeleteConversation = async (convId) => {
    if (!userId || !window.confirm('Delete this conversation?')) return;
    
    try {
      const response = await axios.delete(`${CONVERSATIONS_ENDPOINT}/${convId}`, {
        params: { userId }
      });
      
      if (response.data.success) {
        await fetchConversations(userId);
        if (convId === conversationId) {
          setConversationId(generateUUID());
          setMessages([
            {
              id: 1,
              type: 'assistant',
              content: '👋 Hello! I\'m your Agricultural AI Assistant. How can I help you today?',
              timestamp: new Date().toISOString()
            }
          ]);
          setConversationHistory([]);
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const handleSaveConversationName = async () => {
    if (!conversationName.trim() || !conversationId || !userId) return;

    try {
      const response = await axios.put(
        `${CONVERSATIONS_ENDPOINT}/${conversationId}/title`,
        { title: conversationName },
        { params: { userId } }
      );

      if (response.data.success) {
        console.log('Conversation title updated');
        await fetchConversations(userId);
        setShowNameDialog(false);
        setConversationName('');
      }
    } catch (err) {
      console.error('Error updating conversation title:', err);
    }
  };

  const handleRenameConversation = async (convId) => {
    if (!renameValue.trim() || !userId) return;

    try {
      const response = await axios.put(
        `${CONVERSATIONS_ENDPOINT}/${convId}/title`,
        { title: renameValue },
        { params: { userId } }
      );

      if (response.data.success) {
        console.log('Conversation renamed');
        await fetchConversations(userId);
        setRenameConvId(null);
        setRenameValue('');
      }
    } catch (err) {
      console.error('Error renaming conversation:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await axios.post(
        OPENAI_API_ENDPOINT,
        {
          message: currentMessage,
          conversationHistory: conversationHistory,
          conversationId: conversationId,
          userId: userId
        },
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.conversationHistory) {
        setConversationHistory(response.data.conversationHistory);
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      if (conversationHistory.length === 0) {
        setIsFirstMessage(true);
        setShowNameDialog(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorContent = 'Sorry, I encountered an error. ';
      
      if (error.code === 'ECONNABORTED') {
        errorContent += 'The request timed out. Please try again.';
      } else if (error.response) {
        errorContent += error.response.data?.error || error.response.data?.details || 'Server error occurred.';
      } else if (error.request) {
        errorContent += 'Cannot reach the server. Please make sure the server is running on port 5000.';
      } else {
        errorContent += error.message || 'An unexpected error occurred.';
      }

      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(errorContent);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([
        {
          id: Date.now(),
          type: 'assistant',
          content: '👋 Hello! I\'m your Agricultural AI Assistant. How can I help you today?',
          timestamp: new Date().toISOString()
        }
      ]);
      setConversationHistory([]);
      setError(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Glass Morphism Header */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4">
                🤖 AI Agricultural Assistant
              </h1>
              <p className="text-lg lg:text-xl text-emerald-800/80 leading-relaxed">
                Powered by OpenAI - Instant answers to farming questions
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              💬 Chat Support
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              📚 Conversation History
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🎯 Real-time Assistance
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="px-4 md:px-6 py-3 bg-gradient-to-r from-white/30 to-emerald-50/20 border-b border-white/30 flex items-center justify-between gap-3">
          <h2 className="text-sm md:text-base font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent flex items-center whitespace-nowrap">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2 flex-shrink-0"></span>
            Chat
          </h2>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className="px-2 md:px-3 py-1.5 md:py-2 backdrop-blur-md bg-white/50 hover:bg-white/60 border border-white/40 rounded-lg text-emerald-700 font-semibold transition-all text-xs hover:shadow-lg"
            >
              📋 History
            </button>
            <button
              onClick={handleClearChat}
              className="px-2 md:px-3 py-1.5 md:py-2 backdrop-blur-md bg-white/50 hover:bg-white/60 border border-white/40 rounded-lg text-emerald-700 font-semibold transition-all text-xs hover:shadow-lg"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white/15 to-emerald-50/5">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-emerald-600 to-green-600 text-white'
                    : message.isError
                    ? 'bg-red-50/80 text-red-800 border border-red-300/40'
                    : 'bg-white/50 text-emerald-900 border border-white/40'
                }`}>
                  <div className="text-sm leading-relaxed">
                    {message.type === 'user' ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      }}>
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-emerald-200' : 'text-emerald-600'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white/50 px-4 py-3 rounded-2xl border border-white/40">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/30 bg-gradient-to-b from-white/20 to-white/10 p-4 md:p-6 space-y-2 flex-shrink-0">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about farming, diseases, crops..."
                disabled={isTyping}
                className="flex-1 p-3 bg-emerald-50/80 border-2 border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-emerald-900 placeholder-emerald-600 disabled:opacity-50 text-sm shadow-md transition-all"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className={`px-4 py-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                  !inputMessage.trim() || isTyping
                    ? 'bg-white/30 text-emerald-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:scale-105'
                }`}
              >
                ▲
              </button>
            </div>
            {error && <div className="text-xs text-red-600 bg-red-50/50 px-3 py-1.5 rounded-lg">{error}</div>}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-emerald-800">💾 Save</h3>
            <input
              type="text"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="Name this conversation"
              className="w-full px-3 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-emerald-50/80 text-emerald-900 placeholder-emerald-600 shadow-md transition-all"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setShowNameDialog(false)} className="flex-1 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Skip</button>
              <button onClick={handleSaveConversationName} disabled={!conversationName.trim()} className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300">Save</button>
            </div>
          </div>
        </div>
      )}

      {renameConvId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-emerald-800">✏️ Rename</h3>
            <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} placeholder="New name" className="w-full px-3 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-emerald-50/80 text-emerald-900 placeholder-emerald-600 shadow-md transition-all" autoFocus />
            <div className="flex gap-2">
              <button onClick={() => setRenameConvId(null)} className="flex-1 px-3 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={() => handleRenameConversation(renameConvId)} disabled={!renameValue.trim()} className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg disabled:bg-gray-300">Rename</button>
            </div>
          </div>
        </div>
      )}

      {showHistoryPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[70vh] p-6 flex flex-col">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">📚 History</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.length === 0 ? (
                <p className="text-center text-emerald-600 py-8">No conversations yet</p>
              ) : (
                conversations.map((conv) => (
                  <div key={conv._id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-emerald-900 truncate">{conv.conversationTitle || 'Untitled'}</p>
                      <p className="text-xs text-emerald-600 line-clamp-1">{conv.lastUserMessage}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => { handleLoadConversation(conv._id); setShowHistoryPanel(false); }} className="p-1.5 hover:bg-emerald-200 rounded text-emerald-700">📂</button>
                      <button onClick={() => { setRenameConvId(conv._id); setRenameValue(conv.conversationTitle); }} className="p-1.5 hover:bg-yellow-200 rounded text-yellow-700">✏️</button>
                      <button onClick={() => handleDeleteConversation(conv._id)} className="p-1.5 hover:bg-red-200 rounded text-red-700">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setShowHistoryPanel(false)} className="mt-4 w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default AIAssistant;
