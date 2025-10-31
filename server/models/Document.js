const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  summary: { type: String, default: '' },
  documentType: { type: String, default: '' },
  riskAssessment: { type: String, default: '' }, // allow any string
  complianceCheck: { type: String, default: '' }, // allow any string
  keyPoints: [
    {
      label: { type: String, default: '' },
      content: { type: String, default: '' }
    }
  ],
  recommendations: [{ type: String, default: '' }]
}, { _id: false });

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: String,
  originalName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  status: {
    type: String,
    enum: ['uploaded', 'analyzing', 'completed', 'failed'],
    default: 'uploaded'
  },
  analysis: { type: analysisSchema, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
