const express = require('express');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();
require('dotenv').config();


// ✅ Use your local Flask AI API endpoint here
const AI_API_URL = process.env.AI_API_URL;
const AI_PREDICT_URL = `${AI_API_URL}/predict`;


router.post('/chat', auth, async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Send the user's message to the Python AI model
    const response = await axios.post(AI_PREDICT_URL, { message });
    const aiResponse = response.data.response || "Sorry, no response generated.";

    // Return structured response to frontend
    res.json({
      response: aiResponse,
      conversationId: conversationId || generateConversationId(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI chat error:', error.message);

    // If Flask server isn’t running or unreachable
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ message: 'Cannot connect to AI model (Flask server).' });
    }

    res.status(500).json({ message: 'Error processing AI request' });
  }
});

function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;
