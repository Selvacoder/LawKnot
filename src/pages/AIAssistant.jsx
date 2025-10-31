import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AIAssistant.css';

const AIAssistant = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m lawKnotAI, your legal assistant. I can help you with legal questions, document analysis, case research, and more. What would you like to know?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (location.state?.initialQuery) {
      setInputMessage(location.state.initialQuery);
    }
  }, [location.state]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isAuthenticated) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError('');

    try {
      const response = await aiAPI.chat(inputMessage, conversationId);
      
      if (!conversationId) {
        setConversationId(response.conversationId);
      }
      
      const assistantMessage = {
        id: Date.now(),
        type: 'assistant',
        content: response.response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || 'Failed to get AI response');
      
      const errorMessage = {
        id: Date.now(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What are the elements of a valid contract?",
    "How do I file a trademark application?",
    "What is the difference between copyright and patent?",
    "What are employment law basics?",
    "How to handle a breach of contract?",
    "What are the steps in civil litigation?"
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">AI Legal Assistant</h1>
      <p className="page-subtitle">
        Get instant answers to your legal questions from our AI-powered assistant trained on legal knowledge and case law.
      </p>

      <div className="chat-container">
        {!isAuthenticated && (
          <div className="auth-required">
            <h3>Authentication Required</h3>
            <p>Please log in to chat with the AI assistant.</p>
            <a href="/login" className="btn">Login</a>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'assistant' ? '⚖️' : '👤'}
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar">⚖️</div>
              <div className="message-content typing">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="quick-questions">
            <h3>Quick Questions</h3>
            <div className="questions-grid">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="question-btn"
                  onClick={() => setInputMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your legal question here..."
              className="message-input"
              rows="1"
            />
            <button
              onClick={sendMessage}
             disabled={!inputMessage.trim() || isTyping || !isAuthenticated}
              className="send-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="input-footer">
            <small>Press Enter to send • Shift+Enter for new line</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;