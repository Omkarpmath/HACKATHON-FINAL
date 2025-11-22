const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { requireAuth, requireRole } = require('../middleware/auth');
const { processPDF, estimateTokenCount } = require('../utils/pdfProcessor');
const { generateEmbeddingsBatch } = require('../utils/embeddingService');
const { generateRAGAnswer, diagnoseDiseaseFromSymptoms } = require('../utils/ragService');
const { initializeKnowledgeBase, SYSTEM_USER_ID } = require('../utils/seedKnowledgeBase');
const {
  createDocument,
  getDocumentsByUser,
  getDocumentById,
  deleteDocument
} = require('../models/Document');
const {
  createChunksBatch,
  getChunksByUser,
  deleteChunksByDocument,
  countChunksByDocument
} = require('../models/Chunk');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// GET: AI Assistant page
router.get('/ai-assistant', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const documents = await getDocumentsByUser(req.session.userId);

    res.render('farmer/ai-assistant', {
      user: {
        id: req.session.userId,
        name: req.session.userName,
        role: req.session.userRole
      },
      documents
    });
  } catch (error) {
    console.error('❌ Error loading AI assistant:', error);
    res.status(500).render('error', {
      user: {
        id: req.session.userId,
        name: req.session.userName,
        role: req.session.userRole
      },
      message: 'Failed to load AI assistant'
    });
  }
});

// POST: Upload and process PDF
router.post('/api/ai/upload-pdf', requireAuth, requireRole('farmer'), upload.single('pdf'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file uploaded'
      });
    }

    filePath = req.file.path;
    const { description } = req.body;

    console.log('📤 Processing uploaded PDF:', req.file.originalname);

    // Step 1: Extract and chunk the PDF
    const chunks = await processPDF(filePath);

    if (chunks.length === 0) {
      throw new Error('Failed to extract text from PDF');
    }

    // Step 2: Generate embeddings for all chunks
    const chunkTexts = chunks.map(c => c.text);
    const embeddings = await generateEmbeddingsBatch(chunkTexts);

    // Filter out failed embeddings
    const validChunks = chunks.filter((_, idx) => embeddings[idx] !== null);
    const validEmbeddings = embeddings.filter(e => e !== null);

    if (validChunks.length === 0) {
      throw new Error('Failed to generate embeddings for PDF chunks');
    }

    // Step 3: Save document metadata to database
    const documentId = await createDocument({
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedBy: req.session.userId,
      fileSize: req.file.size,
      totalChunks: validChunks.length,
      description: description || ''
    });

    // Step 4: Save chunks with embeddings to database
    const chunksToSave = validChunks.map((chunk, idx) => ({
      documentId: documentId,
      chunkIndex: chunk.index,
      text: chunk.text,
      embedding: validEmbeddings[idx],
      tokenCount: estimateTokenCount(chunk.text)
    }));

    await createChunksBatch(chunksToSave);

    // Step 5: Delete the temporary file
    await fs.unlink(filePath);

    console.log(`✅ Successfully processed PDF: ${validChunks.length} chunks saved`);

    res.json({
      success: true,
      message: 'PDF processed successfully',
      document: {
        id: documentId,
        name: req.file.originalname,
        chunks: validChunks.length
      }
    });

  } catch (error) {
    console.error('❌ Error processing PDF:', error);

    // Clean up file if it exists
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process PDF'
    });
  }
});

// POST: Ask a question
router.post('/api/ai/ask', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    console.log('❓ Received question:', question);

    // Get all chunks for this user's documents
    const chunks = await getChunksByUser(req.session.userId);

    if (chunks.length === 0) {
      return res.json({
        success: true,
        answer: "I don't have any documents to reference yet. Please upload a PDF document first so I can help answer your questions.",
        sources: []
      });
    }

    // Generate answer using RAG
    const result = await generateRAGAnswer(question, chunks, 3);

    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources
    });

  } catch (error) {
    console.error('❌ Error answering question:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate answer'
    });
  }
});

// GET: List user's documents
router.get('/api/ai/documents', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const documents = await getDocumentsByUser(req.session.userId);

    res.json({
      success: true,
      documents
    });

  } catch (error) {
    console.error('❌ Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents'
    });
  }
});

// DELETE: Delete a document and its chunks
router.delete('/api/ai/documents/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const { id } = req.params;

    // Verify document belongs to user
    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    if (document.uploadedBy.toString() !== req.session.userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this document'
      });
    }

    // Delete all chunks for this document
    const chunksDeleted = await deleteChunksByDocument(id);

    // Delete the document
    await deleteDocument(id);

    // Delete the physical file
    const filePath = path.join(__dirname, '../uploads', document.filename);
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.warn('File already deleted or not found:', filePath);
    }

    console.log(`✅ Deleted document ${id} and ${chunksDeleted} chunks`);

    res.json({
      success: true,
      message: 'Document deleted successfully',
      chunksDeleted
    });

  } catch (error) {
    console.error('❌ Error deleting document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document'
    });
  }
});

// GET: Initialize knowledge base (auto-load livestock.pdf)
router.get('/api/ai/init', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    console.log('🚀 Initializing knowledge base...');
    const isReady = await initializeKnowledgeBase();

    if (isReady) {
      res.json({
        success: true,
        message: 'Knowledge base ready'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to initialize knowledge base'
      });
    }

  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize knowledge base'
    });
  }
});

// POST: Diagnose disease from symptoms
router.post('/api/ai/diagnose', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one symptom is required'
      });
    }

    console.log('🩺 Diagnosing disease from symptoms:', symptoms);

    // Ensure knowledge base is loaded
    await initializeKnowledgeBase();

    // Get all chunks (including system documents)
    const { getAllChunks } = require('../models/Chunk');
    const allChunks = await getAllChunks();

    if (allChunks.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Knowledge base not loaded. Please contact administrator.'
      });
    }

    // Generate diagnosis using RAG
    const diagnosis = await diagnoseDiseaseFromSymptoms(symptoms, allChunks);

    res.json({
      success: true,
      diagnosis
    });

  } catch (error) {
    console.error('❌ Error diagnosing disease:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to diagnose disease'
    });
  }
});

module.exports = router;
