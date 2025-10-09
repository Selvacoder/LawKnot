const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  citation: {
    type: String,
    required: true,
    unique: true
  },
  court: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  jurisdiction: {
    type: String,
    enum: ['Federal', 'California', 'New York', 'Texas', 'Florida', 'Other'],
    required: true
  },
  caseType: {
    type: String,
    enum: ['Contract Law', 'Employment Law', 'Intellectual Property', 'Criminal Law', 'Family Law', 'Real Estate', 'Tax Law', 'Other'],
    required: true
  },
  caseType: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  keyPoints: [String],
  fullText: {
    type: String
  },
  tags: [String],
  precedentValue: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

// Text search index
caseSchema.index({
  title: 'text',
  summary: 'text',
  keyPoints: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Case', caseSchema);