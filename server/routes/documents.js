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

// ✅ Colab or Cloudflare tunnel base URL
const AI_API_URL = process.env.AI_API_URL;
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
      analysis: {}
    });

    await document.save();

    // Run AI analysis asynchronously
    setImmediate(async () => {
      try {
        const analysisResult = await analyzeDocument(document);
        document.analysis = analysisResult;
        document.status = 'completed';
        await document.save();
        console.log(`✅ Analysis completed for: ${document.originalName}`);
      } catch (error) {
        console.error('Background analysis failed:', error.message);
        document.analysis = { summary: 'AI analysis failed.' };
        document.status = 'failed';
        await document.save();
      }
    });

    // Immediate response to frontend
    res.json({
      message: 'Document uploaded successfully',
      documentId: document._id,
      status: 'analyzing',
      analysis: document.analysis
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading document' });
  }
});

// ------------------ ANALYSIS ENDPOINT ------------------
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

// ------------------ AI ANALYSIS LOGIC ------------------
async function analyzeDocument(document) {
  try {
    const fileBuffer = fs.readFileSync(document.filePath);
    let text = '';

    // Extract text from different formats
    if (document.mimeType === 'application/pdf') {
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text.trim();
    } else if (
      document.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      text = value.trim();
    } else {
      text = fileBuffer.toString('utf8').trim();
    }

    if (!text) throw new Error('Empty text extracted from document');

    // Send text to Flask AI summarizer
    const response = await axios.post(
      AI_SUMMARIZE_URL,
      { document: text },
      { timeout: 180000 }
    );

    const data = response.data;

    // ✅ Handle both simple and structured responses
    if (typeof data === 'object' && data.summary) {
      return data; // structured JSON
    } else if (typeof data === 'string') {
      return { summary: data };
    } else {
      return { summary: 'No summary generated.' };
    }
  } catch (error) {
    console.error('AI request error:', error.message);
    return { summary: 'AI analysis failed or timed out.' };
  }
}

module.exports = router;
