import React, { useState } from 'react';
import ChatBot from './ChatBot';
import PdfUpload from './PdfUpload';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [documentsCount, setDocumentsCount] = useState(0);

  const handleUploadSuccess = () => {
    setDocumentsCount(prev => prev + 1);
    // Basculer automatiquement vers le chat après upload
    setTimeout(() => {
      setActiveTab('chat');
    }, 2000);
  };

  return (
    <div className="App">
      {/* Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Chat
        </button>
        
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Documents
          {documentsCount > 0 && (
            <span className="badge">{documentsCount}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'chat' ? (
          <ChatBot />
        ) : (
          <PdfUpload onUploadSuccess={handleUploadSuccess} />
        )}
      </div>

      {/* Footer */}
      <div className="app-footer">
        <p>
          Propulsé par <strong>RAG + Claude/OpenAI</strong> • 
          Créé avec ❤️ pour votre challenge
        </p>
      </div>
    </div>
  );
}

export default App;