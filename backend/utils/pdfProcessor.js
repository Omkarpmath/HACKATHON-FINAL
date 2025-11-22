const fs = require('fs').promises;
const pdfParse = require('pdf-parse');

/**
 * Extract text from a PDF file
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
async function extractTextFromPDF(filePath) {
  try {
    console.log(`📖 Reading PDF file: ${filePath}`);
    const dataBuffer = await fs.readFile(filePath);
    
    console.log('🔍 Parsing PDF content...');
    // pdf-parse exports a function directly
    const data = await pdfParse(dataBuffer);
    
    console.log(`✅ Successfully extracted ${data.text.length} characters`);
    return data.text;
  } catch (error) {
    console.error('❌ Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Split text into chunks with overlap for better context preservation
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size for each chunk (in characters)
 * @param {number} overlap - Number of characters to overlap between chunks
 * @returns {Array<{text: string, index: number}>} Array of text chunks
 */
function chunkText(text, chunkSize = 1500, overlap = 200) {
  const chunks = [];
  let startIndex = 0;
  let chunkIndex = 0;

  // Clean and normalize text
  const cleanedText = text
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newline
    .trim();

  while (startIndex < cleanedText.length) {
    const endIndex = Math.min(startIndex + chunkSize, cleanedText.length);
    let chunkText = cleanedText.substring(startIndex, endIndex);

    // Try to end chunk at a sentence boundary
    if (endIndex < cleanedText.length) {
      const lastPeriod = chunkText.lastIndexOf('. ');
      const lastNewline = chunkText.lastIndexOf('\n');
      const breakPoint = Math.max(lastPeriod, lastNewline);
      
      if (breakPoint > chunkSize * 0.7) { // Only break if we're at least 70% through
        chunkText = chunkText.substring(0, breakPoint + 1);
        startIndex += breakPoint + 1;
      } else {
        startIndex = endIndex;
      }
    } else {
      startIndex = endIndex;
    }

    chunks.push({
      text: chunkText.trim(),
      index: chunkIndex++
    });

    // Apply overlap for next chunk
    if (startIndex < cleanedText.length) {
      startIndex = Math.max(0, startIndex - overlap);
    }
  }

  return chunks;
}

/**
 * Process a PDF file: extract text and split into chunks
 * @param {string} filePath - Absolute path to the PDF file
 * @param {number} chunkSize - Target chunk size
 * @param {number} overlap - Overlap between chunks
 * @returns {Promise<Array>} Array of text chunks
 */
async function processPDF(filePath, chunkSize = 1500, overlap = 200) {
  try {
    console.log('📄 Extracting text from PDF...');
    const text = await extractTextFromPDF(filePath);
    
    console.log(`✅ Extracted ${text.length} characters`);
    
    console.log('✂️ Chunking text...');
    const chunks = chunkText(text, chunkSize, overlap);
    
    console.log(`✅ Created ${chunks.length} chunks`);
    
    return chunks;
  } catch (error) {
    console.error('❌ Error processing PDF:', error);
    throw error;
  }
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 * @param {string} text - Text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

module.exports = {
  extractTextFromPDF,
  chunkText,
  processPDF,
  estimateTokenCount
};
