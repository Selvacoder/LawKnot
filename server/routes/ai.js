const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// AI Chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate AI response based on message content
    const response = generateAIResponse(message);

    res.json({
      response: response,
      conversationId: conversationId || generateConversationId(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Error processing AI request' });
  }
});

// Generate AI response based on input
function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Contract law responses
  if (lowerMessage.includes('contract') || lowerMessage.includes('agreement')) {
    return "For contract law matters, key elements include offer, acceptance, consideration, and mutual assent. A valid contract requires these fundamental components. I recommend reviewing the specific terms, conditions, and any potential breach scenarios. Would you like me to elaborate on any particular aspect of contract law?";
  }
  
  // Employment law responses
  if (lowerMessage.includes('employment') || lowerMessage.includes('workplace') || lowerMessage.includes('termination')) {
    return "Employment law encompasses various aspects including hiring practices, workplace safety, discrimination, and termination procedures. Federal and state laws may apply differently. Key considerations include at-will employment, wrongful termination, and compliance with labor standards. What specific employment law issue would you like to discuss?";
  }
  
  // Intellectual property responses
  if (lowerMessage.includes('patent') || lowerMessage.includes('trademark') || lowerMessage.includes('copyright')) {
    return "Intellectual property law protects creative works and innovations. Patents protect inventions, trademarks protect brand identifiers, and copyrights protect original works of authorship. Each has different requirements, duration, and scope of protection. The application process varies by type. Which form of IP protection are you most interested in?";
  }
  
  // General legal responses
  if (lowerMessage.includes('legal') || lowerMessage.includes('law') || lowerMessage.includes('court')) {
    return "Legal matters require careful analysis of applicable laws, regulations, and precedents. The specific jurisdiction, facts of the case, and timing all play crucial roles in legal outcomes. I recommend consulting with a qualified attorney for specific legal advice. However, I can help you understand general legal principles. What area of law interests you?";
  }
  
  // Default response
  return "Thank you for your question. Based on legal principles and precedent, this matter requires careful consideration of several factors including jurisdiction, applicable statutes, and case law. I'd be happy to help you explore the legal framework around your question. Could you provide more specific details about your situation?";
}

function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;