const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

// Upload document
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = new Document({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await document.save();

    // Start analysis process (simulate)
    setTimeout(async () => {
      try {
        const analysisResult = await analyzeDocument(document);
        document.analysis = analysisResult;
        document.status = 'completed';
        await document.save();
      } catch (error) {
        document.status = 'failed';
        await document.save();
      }
    }, 3000);

    document.status = 'analyzing';
    await document.save();

    res.json({
      message: 'Document uploaded successfully',
      documentId: document._id,
      status: 'analyzing'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading document' });
  }
});

// Get document analysis
router.get('/:id/analysis', auth, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({
      status: document.status,
      analysis: document.analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Error retrieving analysis' });
  }
});

// Get user documents
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-filePath');

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Error retrieving documents' });
  }
});

// Mock document analysis function
async function analyzeDocument(document) {
  // Simulate AI analysis
  const documentTypes = ['Contract Agreement', 'Legal Brief', 'Terms of Service', 'NDA', 'Employment Agreement'];
  const riskLevels = ['Low Risk', 'Medium Risk', 'High Risk'];
  
  return {
    documentType: documentTypes[Math.floor(Math.random() * documentTypes.length)],
    keyPoints: [
      'Payment terms clearly defined',
      'Termination clauses present',
      'Intellectual property rights addressed',
      'Confidentiality provisions included',
      'Dispute resolution mechanism specified'
    ],
    riskAssessment: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    recommendations: [
      'Consider adding force majeure clause',
      'Review indemnification terms',
      'Clarify governing law jurisdiction',
      'Add data protection compliance clause'
    ],
    complianceCheck: 'Compliant with standard legal requirements',
    confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
  };
}

module.exports = router;