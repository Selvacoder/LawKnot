import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organization: '',
    role: 'lawyer'
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const authAction = isLogin ? login : register;
    const authData = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData;

    authAction(authData)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setError(err.message || 'Authentication failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to LawKnot</h1>
          <p>Your AI-powered legal assistant platform</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    required={!isLogin}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    required={!isLogin}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Law firm, company, or institution"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="lawyer">Lawyer</option>
                  <option value="paralegal">Paralegal</option>
                  <option value="law-student">Law Student</option>
                  <option value="legal-researcher">Legal Researcher</option>
                  <option value="corporate-counsel">Corporate Counsel</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          )}

          {isLogin && (
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-footer">
          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn">
              <span>📧</span>
              Google
            </button>
            <button className="social-btn">
              <span>💼</span>
              LinkedIn
            </button>
          </div>

          {!isLogin && (
            <div className="terms-notice">
              <p>
                By creating an account, you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="login-features">
        <h3>Why Choose LawKnot?</h3>
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <div className="feature-content">
              <h4>AI-Powered Analysis</h4>
              <p>Get instant insights from legal documents and cases</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📚</div>
            <div className="feature-content">
              <h4>Comprehensive Database</h4>
              <p>Access thousands of legal precedents and case law</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">👥</div>
            <div className="feature-content">
              <h4>Professional Network</h4>
              <p>Connect with legal professionals worldwide</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <div className="feature-content">
              <h4>Secure & Confidential</h4>
              <p>Enterprise-grade security for your sensitive data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;