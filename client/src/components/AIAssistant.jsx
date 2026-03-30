import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const OPENAI_API_ENDPOINT = `${API_BASE_URL}/api/openai/chat`;
const CONVERSATIONS_ENDPOINT = `${API_BASE_URL}/api/openai/conversations`;

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
      content: 'Hello! I\'m your Agricultural AI Assistant powered by OpenAI. Ask me anything about farming, plant diseases, crop management, or agriculture!',
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
        // Clear current chat and load old conversation
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
        
        // Each message record has both userMessage and aiResponse
        response.data.messages.forEach((msg) => {
          // Add user message
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
          
          // Add AI response
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
              content: 'Hello! I\'m your Agricultural AI Assistant powered by OpenAI. Ask me anything about farming, plant diseases, crop management, or agriculture!',
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
      // Call the OpenAI API with timeout
      const response = await axios.post(
        OPENAI_API_ENDPOINT,
        {
          message: currentMessage,
          conversationHistory: conversationHistory,
          conversationId: conversationId,
          userId: userId
        },
        {
          timeout: 30000, // 30 seconds timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Update conversation history
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

      // Show naming dialog after first message
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
        // Server responded with error
        errorContent += error.response.data?.error || error.response.data?.details || 'Server error occurred.';
      } else if (error.request) {
        // Request made but no response
        errorContent += 'Cannot reach the server. Please make sure the server is running on port 5000.';
      } else {
        // Something else happened
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
          content: 'Hello! I\'m your Agricultural AI Assistant powered by OpenAI. Ask me anything about farming, plant diseases, crop management, or agriculture!',
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
      {/* Header */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-3">
            🤖 Agricultural AI Assistant
          </h1>
          <p className="text-lg text-emerald-800/80">
            Powered by OpenAI - Ask me anything about agriculture!
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20 flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center min-w-0">
            <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="truncate">Chat with AI</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className="px-3 sm:px-4 py-2 backdrop-blur-md bg-white/40 hover:bg-white/50 border border-white/30 rounded-xl text-emerald-700 font-medium transition-all duration-300 flex items-center space-x-2 text-sm shrink-0"
              title="View conversation history"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>History</span>
            </button>
            <button
              onClick={handleClearChat}
              className="px-3 sm:px-4 py-2 backdrop-blur-md bg-white/40 hover:bg-white/50 border border-white/30 rounded-xl text-emerald-700 font-medium transition-all duration-300 flex items-center space-x-2 text-sm shrink-0"
              title="Clear chat history"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col h-[60vh] min-h-[360px] sm:h-[500px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 backdrop-blur-md bg-white/20 border border-white/20 rounded-2xl mb-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] px-3 sm:px-4 py-3 rounded-2xl shadow-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                            : message.isError
                            ? 'backdrop-blur-md bg-red-50/70 text-red-800 border border-red-300/40'
                            : 'backdrop-blur-md bg-white/50 text-emerald-800 border border-white/40'
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {message.type === 'user' ? (
                            <p className="whitespace-pre-wrap text-white">{message.content}</p>
                          ) : (
                            <div className={message.isError ? 'text-red-800' : 'text-emerald-800'}>
                              <ReactMarkdown
                                components={{
                                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                                  ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                  strong: ({node, ...props}) => <strong className="font-bold text-emerald-900" {...props} />,
                                  em: ({node, ...props}) => <em className="italic" {...props} />,
                                  h1: ({node, ...props}) => <h1 className="text-lg font-bold text-emerald-900 mb-2 mt-2" {...props} />,
                                  h2: ({node, ...props}) => <h2 className="text-base font-bold text-emerald-900 mb-2 mt-2" {...props} />,
                                  h3: ({node, ...props}) => <h3 className="text-sm font-bold text-emerald-900 mb-1 mt-1" {...props} />,
                                  code: ({node, inline, ...props}) => 
                                    inline ? 
                                      <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-900 text-xs" {...props} /> : 
                                      <code className="block bg-emerald-100 p-2 rounded my-2 text-emerald-900 text-xs overflow-x-auto" {...props} />
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-emerald-200' : message.isError ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="backdrop-blur-md bg-white/50 border border-white/40 max-w-xs px-4 py-3 rounded-2xl shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-emerald-600 font-medium">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>



                {/* Input Area */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about agriculture..."
                      disabled={isTyping}
                      className="w-full p-4 backdrop-blur-md bg-white/40 border border-white/30 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none placeholder-emerald-600/60 text-emerald-800 transition-all duration-300 focus:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      rows="2"
                    />
                    {error && (
                      <div className="absolute -bottom-6 left-0 text-xs text-red-600 mt-1">
                        Click send to retry
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
                      !inputMessage.trim() || isTyping
                        ? 'backdrop-blur-md bg-white/30 border border-white/30 text-emerald-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>{isTyping ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Name Conversation Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-emerald-800">Name This Conversation</h3>
            <p className="text-sm text-emerald-600">Give your conversation a meaningful name to help you find it later.</p>
            <input
              type="text"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveConversationName()}
              placeholder="e.g., Tomato Plant Diseases"
              className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNameDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-all"
              >
                Skip
              </button>
              <button
                onClick={handleSaveConversationName}
                disabled={!conversationName.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Conversation Dialog */}
      {renameConvId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-emerald-800">Rename Conversation</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRenameConversation(renameConvId)}
              placeholder="Enter new name"
              className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRenameConvId(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRenameConversation(renameConvId)}
                disabled={!renameValue.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-all"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] p-6 space-y-4 flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-800">Conversation History</h3>
              <button
                onClick={() => setShowHistoryPanel(false)}
                className="text-gray-500 hover:text-gray-700 transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {conversations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-emerald-600">No previous conversations</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto flex-1">
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-emerald-900">
                          {conv.conversationTitle || 'Untitled'}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-emerald-700">You:</p>
                            <p className="text-xs text-emerald-600 line-clamp-2">
                              {conv.lastUserMessage}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-emerald-700">AI:</p>
                            <p className="text-xs text-emerald-600 line-clamp-2">
                              {conv.lastAiResponse}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-emerald-500 mt-2">
                          {new Date(conv.latestTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            handleLoadConversation(conv._id);
                            setShowHistoryPanel(false);
                          }}
                          className="p-2 hover:bg-emerald-200 rounded-lg transition-all"
                          title="Load conversation"
                        >
                          <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setRenameConvId(conv._id);
                            setRenameValue(conv.conversationTitle);
                          }}
                          className="p-2 hover:bg-amber-200 rounded-lg transition-all"
                          title="Rename conversation"
                        >
                          <svg className="w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteConversation(conv._id)}
                          className="p-2 hover:bg-red-200 rounded-lg transition-all"
                          title="Delete conversation"
                        >
                          <svg className="w-4 h-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
              