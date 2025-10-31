import React, { useState } from 'react';
import { documentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DocumentAnalysis.css';

const DocumentAnalysis = () => {
  const { isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setSelectedFile(e.dataTransfer.files[0]);
  };

  const analyzeDocument = () => {
    if (!selectedFile || !isAuthenticated) return;

    setIsAnalyzing(true);
    setError('');
    setSummary('');

    documentsAPI
      .upload(selectedFile)
      .then((response) => {
        const documentId = response.documentId;

        const pollAnalysis = () => {
          documentsAPI
            .getAnalysis(documentId)
            .then((data) => {
              if (data.status === 'completed') {
                setSummary(data.analysis.summary);
                setIsAnalyzing(false);
              } else if (data.status === 'failed') {
                setError('Document analysis failed. Please try again.');
                setIsAnalyzing(false);
              } else {
                setTimeout(pollAnalysis, 2000);
              }
            })
            .catch((err) => {
              setError(err.message || 'Failed to get analysis results');
              setIsAnalyzing(false);
            });
        };

        setTimeout(pollAnalysis, 2000);
      })
      .catch((err) => {
        setError(err.message || 'Failed to upload document');
        setIsAnalyzing(false);
      });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Document Summary</h1>
      <p className="page-subtitle">
        Upload your legal document and get an AI-generated summary instantly.
      </p>

      <div className="analysis-container">
        {!isAuthenticated && (
          <div className="auth-required">
            <h3>Authentication Required</h3>
            <p>Please log in to upload and summarize documents.</p>
            <a href="/login" className="btn">
              Login
            </a>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="upload-section">
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-icon">📄</div>
            <h3>Drop your document here</h3>
            <p>or click to browse</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="file-input"
            />
            <div className="supported-formats">
              Supported: PDF, DOC, DOCX, TXT
            </div>
          </div>

          {selectedFile && (
            <div className="selected-file">
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <div className="file-name">{selectedFile.name}</div>
                  <div className="file-size">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </div>
                </div>
                <button
                  className="remove-file"
                  onClick={() => setSelectedFile(null)}
                >
                  ✕
                </button>
              </div>
              <button
                className="btn analyze-btn"
                onClick={analyzeDocument}
                disabled={isAnalyzing || !isAuthenticated}
              >
                {isAnalyzing ? 'Analyzing...' : 'Generate Summary'}
              </button>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="analyzing-section">
            <div className="loading-spinner"></div>
            <h3>Generating your summary...</h3>
            <p>This may take a few moments</p>
          </div>
        )}

        {summary && (
          <div className="results-section">
            <h2>AI Summary Result</h2>
            <div className="result-section">
              <p className="summary-text">{summary}</p>
            </div>
            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSummary('');
                  setSelectedFile(null);
                }}
              >
                Analyze Another Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis;
