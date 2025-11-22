const path = require('path');
const { processPDF } = require('./pdfProcessor');
const { generateEmbeddingsBatch } = require('./embeddingService');
const { estimateTokenCount } = require('./pdfProcessor');
const { createDocument, getDocumentsByUser } = require('../models/Document');
const { createChunksBatch } = require('../models/Chunk');

const SYSTEM_PDF_PATH = path.join(__dirname, '../test-documents/livestock.pdf');
const SYSTEM_USER_ID = 'SYSTEM'; // Special ID for system documents

/**
 * Check if the knowledge base (livestock.pdf) is already loaded
 * @returns {Promise<boolean>} True if loaded, false otherwise
 */
async function isKnowledgeBaseLoaded() {
  try {
    const documents = await getDocumentsByUser(SYSTEM_USER_ID);
    return documents.some(doc => doc.filename === 'livestock.pdf' && doc.isSystemDocument);
  } catch (error) {
    console.error('Error checking knowledge base:', error);
    return false;
  }
}

/**
 * Load the livestock.pdf into the knowledge base
 * @returns {Promise<object>} Document info or null if failed
 */
async function loadKnowledgeBase() {
  try {
    console.log('📚 Loading livestock knowledge base...');

    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(SYSTEM_PDF_PATH)) {
      console.error('❌ livestock.pdf not found at:', SYSTEM_PDF_PATH);
      return null;
    }

    // Process the PDF
    const chunks = await processPDF(SYSTEM_PDF_PATH);

    if (chunks.length === 0) {
      throw new Error('No content extracted from livestock.pdf');
    }

    console.log(`✅ Extracted ${chunks.length} chunks from livestock.pdf`);

    // Generate embeddings
    const chunkTexts = chunks.map(c => c.text);
    const embeddings = await generateEmbeddingsBatch(chunkTexts, 1200); // Slower rate for batch

    // Filter valid chunks
    const validChunks = chunks.filter((_, idx) => embeddings[idx] !== null);
    const validEmbeddings = embeddings.filter(e => e !== null);

    if (validChunks.length === 0) {
      throw new Error('Failed to generate embeddings for livestock.pdf');
    }

    // Save document metadata
    const documentId = await createDocument({
      filename: 'livestock.pdf',
      originalName: 'Livestock Health Knowledge Base',
      uploadedBy: SYSTEM_USER_ID,
      fileSize: fs.statSync(SYSTEM_PDF_PATH).size,
      totalChunks: validChunks.length,
      description: 'System knowledge base for livestock disease diagnosis',
      isSystemDocument: true
    });

    // Save chunks with embeddings
    const chunksToSave = validChunks.map((chunk, idx) => ({
      documentId: documentId,
      chunkIndex: chunk.index,
      text: chunk.text,
      embedding: validEmbeddings[idx],
      tokenCount: estimateTokenCount(chunk.text)
    }));

    await createChunksBatch(chunksToSave);

    console.log('✅ Livestock knowledge base loaded successfully');
    
    return {
      documentId,
      chunks: validChunks.length
    };

  } catch (error) {
    console.error('❌ Failed to load knowledge base:', error);
    return null;
  }
}

/**
 * Initialize knowledge base (load if not already loaded)
 * @returns {Promise<boolean>} True if ready, false if failed
 */
async function initializeKnowledgeBase() {
  try {
    const isLoaded = await isKnowledgeBaseLoaded();
    
    if (isLoaded) {
      console.log('✅ Livestock knowledge base already loaded');
      return true;
    }

    console.log('📚 Knowledge base not found, loading livestock.pdf...');
    const result = await loadKnowledgeBase();
    
    return result !== null;

  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
    return false;
  }
}

module.exports = {
  isKnowledgeBaseLoaded,
  loadKnowledgeBase,
  initializeKnowledgeBase,
  SYSTEM_USER_ID
};
