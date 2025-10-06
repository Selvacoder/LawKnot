import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'email@gmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '📞',
      title: 'Phone',
      content: '999999999',
      description: 'Mon-Fri from 8am to 6pm IST'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      content: 'Available 24/7',
      description: 'Get instant support'
    }
  ];

  const faqs = [
    {
      question: "How accurate is LawKnotAI's legal analysis?",
      answer: "LawKnotAI uses advanced AI trained on extensive legal databases with 95%+ accuracy. However, all AI-generated content should be reviewed by qualified legal professionals."
    },
    {
      question: "Is my data secure with LawKnotAI?",
      answer: "Yes, we use enterprise-grade encryption and security measures. Your data is protected with bank-level security and we never share confidential information."
    },
    {
      question: "Can I try LawKnotAI before subscribing?",
      answer: "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "What types of legal documents can LawKnotAI analyze?",
      answer: "LawKnotAI can analyze contracts, agreements, legal briefs, case documents, statutes, regulations, and more. We support PDF, DOCX, and TXT formats."
    }
  ];

  return (
    <div className="page-container">
      <div className="contact-hero">
        <h1 className="page-title">Get in Touch</h1>
        <p className="page-subtitle">
          Have questions about LawKnotAI? We're here to help. Reach out to our team 
          and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-form-section">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="contact-form">
              <h2>Send us a Message</h2>
              
              <div className="form-group">
                <label className="form-label">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="general">General Inquiry</option>
                  <option value="sales">Sales & Pricing</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
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
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your inquiry"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please provide details about your inquiry..."
                  className="form-input message-textarea"
                  rows="6"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Message Sent Successfully!</h2>
              <p>
                Thank you for contacting us. We've received your message and will 
                get back to you within 24 hours.
              </p>
              <button 
                className="btn btn-secondary"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>

        <div className="contact-info-section">
          <h2>Contact Information</h2>
          <div className="contact-cards">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <div className="contact-icon">{info.icon}</div>
                <div className="contact-details">
                  <h3>{info.title}</h3>
                  <div className="contact-content">{info.content}</div>
                  <div className="contact-description">{info.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="emergency-contact">
            <h3>Need Immediate Help?</h3>
            <p>For urgent technical issues, use our 24/7 live chat or call our emergency support line.</p>
            <button className="btn">Start Live Chat</button>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-card">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="faq-footer">
          <p>Can't find what you're looking for?</p>
          <button className="btn btn-secondary">View All FAQs</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;