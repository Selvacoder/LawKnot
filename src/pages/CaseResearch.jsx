import React, { useState } from 'react';
import { casesAPI } from '../services/api';
import './CaseResearch.css';

const CaseResearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    jurisdiction: 'all',
    court: 'all',
    dateRange: 'all',
    caseType: 'all'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const searchParams = {
        q: searchQuery,
        jurisdiction: filters.jurisdiction,
        caseType: filters.caseType,
        court: filters.court,
        page: 1,
        limit: 20
      };
      
      const response = await casesAPI.search(searchParams);
      setSearchResults(response.cases);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Case Research</h1>
      <p className="page-subtitle">
        Search through legal precedents, case law, and court decisions to find relevant authorities for your legal research.
      </p>

      <div className="research-container">
        <div className="search-section">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search cases, keywords, parties, or legal concepts..."
              className="search-input"
            />
            <button 
              className="search-button"
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
            >
              {isSearching ? '🔄' : '🔍'}
            </button>
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <label>Jurisdiction</label>
              <select 
                value={filters.jurisdiction}
                onChange={(e) => setFilters({...filters, jurisdiction: e.target.value})}
              >
                <option value="all">All Jurisdictions</option>
                <option value="federal">Federal</option>
                <option value="california">California</option>
                <option value="new-york">New York</option>
                <option value="texas">Texas</option>
                <option value="florida">Florida</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Court Level</label>
              <select 
                value={filters.court}
                onChange={(e) => setFilters({...filters, court: e.target.value})}
              >
                <option value="all">All Courts</option>
                <option value="supreme">Supreme Court</option>
                <option value="appeals">Appeals Court</option>
                <option value="district">District Court</option>
                <option value="state-supreme">State Supreme</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Case Type</label>
              <select 
                value={filters.caseType}
                onChange={(e) => setFilters({...filters, caseType: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="contract-law">Contract Law</option>
                <option value="intellectual-property">Intellectual Property</option>
                <option value="employment-law">Employment Law</option>
                <option value="criminal-law">Criminal Law</option>
                <option value="family-law">Family Law</option>
                <option value="real-estate">Real Estate</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">All Dates</option>
                <option value="last-year">Last Year</option>
                <option value="last-5-years">Last 5 Years</option>
                <option value="last-10-years">Last 10 Years</option>
              </select>
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="searching-indicator">
            <div className="loading-spinner"></div>
            <p>Searching legal databases...</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Search Results ({searchResults.length})</h2>
              <div className="sort-options">
                <select>
                  <option>Relevance</option>
                  <option>Date (Newest)</option>
                  <option>Date (Oldest)</option>
                  <option>Court Level</option>
                </select>
              </div>
            </div>

            <div className="results-list">
              {searchResults.map(caseItem => (
                <div key={caseItem.id} className="case-card">
                  <div className="case-header">
                    <h3 className="case-title">{caseItem.title}</h3>
                    <div className="case-badges">
                      <span className="case-type-badge">{caseItem.type}</span>
                      <span className="jurisdiction-badge">{caseItem.jurisdiction}</span>
                    </div>
                  </div>
                  
                  <div className="case-citation">{caseItem.citation}</div>
                  
                  <div className="case-meta">
                    <span className="case-court">{caseItem.court}</span>
                    <span className="case-date">{new Date(caseItem.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="case-summary">
                    {caseItem.summary}
                  </div>
                  
                  <div className="key-points">
                    <h4>Key Points:</h4>
                    <ul>
                      {caseItem.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="case-actions">
                    <button className="case-action-btn">📄 View Full Text</button>
                    <button 
                      className="case-action-btn"
                      onClick={() => navigator.clipboard.writeText(caseItem.citation)}
                    >
                      📋 Copy Citation
                    </button>
                    <button className="case-action-btn">📤 Export</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && searchQuery && !isSearching && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No Cases Found</h3>
            <p>Try adjusting your search terms or filters to find relevant cases.</p>
            <div className="search-suggestions">
              <h4>Search Tips:</h4>
              <ul>
                <li>Use specific legal terms or case names</li>
                <li>Try broader search terms</li>
                <li>Check different jurisdictions</li>
                <li>Expand the date range</li>
              </ul>
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="research-tips">
            <h3>Research Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">💡</div>
                <h4>Use Keywords</h4>
                <p>Search using specific legal terms, party names, or legal concepts for better results.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <h4>Filter Results</h4>
                <p>Narrow your search using jurisdiction, court level, and case type filters.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📚</div>
                <h4>Review Citations</h4>
                <p>Pay attention to citation formats and court levels for proper legal authority.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🔗</div>
                <h4>Follow References</h4>
                <p>Look for cases cited within decisions to find related precedents.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseResearch;