const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  analysis: {
    documentType: String,
    keyPoints: [String],
    riskAssessment: {
      type: String,
      enum: ['Low Risk', 'Medium Risk', 'High Risk']
    },
    recommendations: [String],
    complianceCheck: String,
    confidence: Number
  },
  status: {
    type: String,
    enum: ['uploaded', 'analyzing', 'completed', 'failed'],
    default: 'uploaded'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);