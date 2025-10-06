import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/ai-assistant', { state: { initialQuery: query } });
    }
  };

  const features = [
    {
      title: 'Document Analysis',
      description: 'Upload and analyze legal documents with AI-powered insights',
      icon: '📄',
      path: '/document-analysis'
    },
    {
      title: 'AI Legal Assistant',
      description: 'Get instant answers to your legal questions from our AI assistant',
      icon: '⚖️',
      path: '/ai-assistant'
    },
    {
      title: 'Legal Forum',
      description: 'Connect with legal professionals and discuss complex cases',
      icon: '💬',
      path: '/forum'
    },
    {
      title: 'Case Research',
      description: 'Search and research legal precedents and case histories',
      icon: '🔍',
      path: '/case-research'
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your AI-Powered Legal Assistant
          </h1>
          <p className="hero-subtitle">
            Streamline legal research, analyze documents, and get expert insights with our advanced AI platform designed for legal professionals.
          </p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-container">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a legal question or describe your case..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <span>Ask LawKnotAI</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </form>
          
          <div className="quick-actions">
            <span className="quick-actions-label">Popular queries:</span>
            <button onClick={() => setQuery("What are the requirements for filing a patent?")} className="quick-action-btn">
              Patent Filing
            </button>
            <button onClick={() => setQuery("How to draft a non-disclosure agreement?")} className="quick-action-btn">
              NDA Drafting
            </button>
            <button onClick={() => setQuery("Employment law termination procedures")} className="quick-action-btn">
              Employment Law
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="features-title">Powerful Legal Tools</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">...</div>
            <div className="stat-label">Legal Documents Analyzed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">...</div>
            <div className="stat-label">Legal Professionals</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">...</div>
            <div className="stat-label">Cases Researched</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">...</div>
            <div className="stat-label">AI Assistant Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;