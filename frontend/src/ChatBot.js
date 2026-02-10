import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Bonjour ! Je suis votre assistant documentaire. Posez-moi des questions sur les documents PDF que vous avez uploadés.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/ask', {
        question: input
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="bot-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="header-info">
            <h2>Assistant RAG</h2>
            <p className="status">
              <span className="status-dot"></span>
              En ligne
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-wrapper ${msg.role}`}
          >
            <div className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="message-avatar">🤖</div>
              )}
              
              <div className="message-content-wrapper">
                <div className="message-content">
                  {msg.content}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="sources-container">
                    <div className="sources-header">
                      📚 Sources trouvées ({msg.sources.length})
                    </div>
                    <div className="sources-list">
                      {msg.sources.map((source, i) => (
                        <div key={i} className="source-item">
                          <div className="source-number">{i + 1}</div>
                          <div className="source-text">
                            {source.text}
                          </div>
                          <div className="source-score">
                            Score: {(1 - source.score).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="message-time">
                  {formatTime(msg.timestamp)}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="message-avatar user-avatar">👤</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-wrapper assistant">
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content-wrapper">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question sur les documents..."
            rows="1"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className="send-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="input-hint">
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </div>
      </div>
    </div>
  );
}

export default ChatBot;