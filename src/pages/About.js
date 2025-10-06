import React from 'react';
import './About.css';

const About = () => {
  const team = [
    {
      name: "Sakesh",
      role: "Leader",
      bio: "Frontend Developer.",
      image: "👨‍💻"
    },
    {
      name: "Ricky Joel",
      role: "Designer",
      bio: "UI/UX.",
      image: "👨‍💻"
    },
    {
      name: "Selva Balaji",
      role: "Lead Developer",
      bio: "Full-stack developer.",
      image: "👨‍💻"
    }
  ];

  const values = [
    {
      title: "Accuracy",
      description: "We ensure our AI provides precise and reliable legal information",
      icon: "🎯"
    },
    {
      title: "Security",
      description: "Your sensitive legal data is protected with enterprise-grade security",
      icon: "🔒"
    },
    {
      title: "Innovation",
      description: "Constantly advancing AI technology to serve the legal community better",
      icon: "⚡"
    },
    {
      title: "Accessibility",
      description: "Making legal assistance available to professionals everywhere",
      icon: "🌍"
    }
  ];

  return (
    <div className="page-container">
      <div className="about-hero">
        <h1 className="page-title">About lawknotAI</h1>
        <p className="hero-text">
          We're revolutionizing legal research and analysis through artificial intelligence, 
          making legal work more efficient and accessible for professionals worldwide.
        </p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <div className="content-grid">
            <div className="text-content">
              <h2>Our Mission</h2>
              <p>
                At LawKnotAI, we believe that technology should empower legal professionals, 
                not replace them. Our mission is to democratize access to legal knowledge 
                and streamline complex legal processes through cutting-edge AI technology.
              </p>
              <p>
                Founded by legal professionals and AI experts, we understand the unique 
                challenges faced by lawyers, paralegals, and legal researchers. Our platform 
                is designed to save time, improve accuracy, and enhance the quality of legal work.
              </p>
            </div>
            <div className="image-placeholder">
              <div className="mission-visual">
                <div className="visual-element">⚖️</div>
                <div className="visual-element">🤖</div>
                <div className="visual-element">📚</div>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="story-section">
          <h2>Our Story</h2>
          <div className="story-timeline">
            <div className="timeline-item">
              <div className="timeline-year">JULY 2025</div>
              <div className="timeline-content">
                <h3>The Beginning</h3>
                <p>research about Laws based AI's.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">SEP 2025</div>
              <div className="timeline-content">
                <h3>First Prototype</h3>
                <p>Frontend and 50% of the Backend.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">...</div>
              <div className="timeline-content">
                <h3>...</h3>
                <p>...</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">...</div>
              <div className="timeline-content">
                <h3>...</h3>
                <p>...</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">{member.image}</div>
                <h3>{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <h2>LexiAI by the Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">...</div>
              <div className="stat-label">Documents Analyzed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">...</div>
              <div className="stat-label">Legal Professionals</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">...</div>
              <div className="stat-label">AI Queries Processed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">...</div>
              <div className="stat-label">Uptime Reliability</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;