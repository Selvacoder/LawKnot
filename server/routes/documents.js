const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const router = express.Router();
require('dotenv').config();

// ------------------ AI CONFIG ------------------
const AI_API_URL = process.env.AI_API_URL; // e.g. http://127.0.0.1:7000
const AI_SUMMARIZE_URL = `${AI_API_URL}/summarize`;

// ------------------ MULTER CONFIG ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
  }
});

// ------------------ UPLOAD ENDPOINT ------------------
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const document = new Document({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'analyzing',
      analysis: {} // will hold summary
    });

    await document.save();

    // Run AI analysis asynchronously
    setImmediate(async () => {
      try {
        const summary = await analyzeDocument(document);

        await Document.findByIdAndUpdate(document._id, {
          status: 'completed',
          analysis: { summary }
        });

        console.log(`✅ Summary saved for: ${document.originalName}`);
      } catch (error) {
        console.error('Background analysis failed:', error.message);
        await Document.findByIdAndUpdate(document._id, {
          status: 'failed',
          analysis: { summary: 'AI analysis failed.' }
        });
      }
    });

    // Immediate response to frontend
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

// ------------------ GET ANALYSIS ------------------
router.get('/:id/analysis', auth, async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.userId });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json({ status: document.status, analysis: document.analysis });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Error retrieving analysis' });
  }
});

// ------------------ USER DOCUMENTS ------------------
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

// ------------------ AI ANALYSIS FUNCTION ------------------
async function analyzeDocument(document) {
  try {
    const fileBuffer = fs.readFileSync(document.filePath);
    let text = '';

    // Extract text from file
    if (document.mimeType === 'application/pdf') {
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text.trim();
    } else if (document.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      text = value.trim();
    } else {
      text = fileBuffer.toString('utf8').trim();
    }

    if (!text) throw new Error('Empty text extracted from document');

    // Limit to 300 words
    const words = text.split(/\s+/);
    if (words.length > 300) {
      text = words.slice(0, 300).join(' ') + '\n\n[Note: Document truncated to 300 words for summary.]';
    }

    console.log('🔁 Sending document to Flask summarizer...');

    // Send to Flask summarizer
    const response = await axios.post(AI_SUMMARIZE_URL, { document: text }, { timeout: 180000 });

    // Flask returns only: { summary: "..." }
    const summary = response.data?.summary || 'No summary returned.';

    return summary;

  } catch (error) {
    console.error('AI analysis error:', error.message);
    return 'AI analysis failed or timed out.';
  }
}

module.exports = router;
