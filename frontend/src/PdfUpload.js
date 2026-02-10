import React, { useState } from 'react';
import axios from 'axios';
import './PdfUpload.css';

function PdfUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setMessage(null);
      } else {
        setMessage({
          type: 'error',
          text: '⚠️ Veuillez sélectionner un fichier PDF'
        });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setMessage(null);
      } else {
        setMessage({
          type: 'error',
          text: '⚠️ Veuillez sélectionner un fichier PDF'
        });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:8000/upload-pdf', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      setMessage({
        type: 'success',
        text: `✅ ${response.data.message}`,
        chunks: response.data.chunks
      });

      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        if (onUploadSuccess) onUploadSuccess();
      }, 2000);

    } catch (error) {
      console.error('Erreur upload:', error);
      setMessage({
        type: 'error',
        text: '❌ Erreur lors de l\'upload. Veuillez réessayer.'
      });
      setUploadProgress(0);
    }

    setUploading(false);
  };

  const removeFile = () => {
    setFile(null);
    setMessage(null);
    setUploadProgress(0);
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2>📄 Ajouter des Documents</h2>
        <p>Uploadez vos PDFs pour permettre au chatbot de répondre à vos questions</p>
      </div>

      <div
        className={`dropzone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="dropzone-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 18C7 18.5304 7.21071 19.0391 7.58579 19.4142C7.96086 19.7893 8.46957 20 9 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V9.41421C20 9.149 19.8946 8.89464 19.7071 8.70711L14.2929 3.29289C14.1054 3.10536 13.851 3 13.5858 3H9C8.46957 3 7.96086 3.21071 7.58579 3.58579C7.21071 3.96086 7 4.46957 7 5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 3V8C14 8.26522 14.1054 8.51957 14.2929 8.70711C14.4804 8.89464 14.7348 9 15 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="dropzone-text">
              <p className="primary-text">
                Glissez-déposez votre PDF ici
              </p>
              <p className="secondary-text">ou</p>
            </div>
            <label className="file-input-label">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <span>Parcourir les fichiers</span>
            </label>
            <p className="help-text">Format accepté : PDF (max 50MB)</p>
          </>
        ) : (
          <div className="file-preview">
            <div className="file-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatFileSize(file.size)}</p>
            </div>
            <button
              className="remove-file-btn"
              onClick={removeFile}
              disabled={uploading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {file && !uploading && (
        <button className="upload-btn" onClick={handleUpload}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Uploader le document
        </button>
      )}

      {uploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="progress-text">Upload en cours... {uploadProgress}%</p>
        </div>
      )}

      {message && (
        <div className={`message-box ${message.type}`}>
          <div className="message-content">
            <p>{message.text}</p>
            {message.chunks && (
              <p className="chunks-info">
                {message.chunks} segments créés pour la recherche
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PdfUpload;