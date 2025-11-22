const { HfInference } = require('@huggingface/inference');

let hfClient = null;

/**
 * Initialize Hugging Face client
 */
function initializeHF() {
  if (!hfClient && process.env.HUGGINGFACE_API_KEY) {
    hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }
  return hfClient;
}

/**
 * Generate embedding for a single text using Hugging Face
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array<number>>} Embedding vector (384 dimensions)
 */
async function generateEmbedding(text) {
  try {
    const client = initializeHF();
    
    if (!client) {
      throw new Error('Hugging Face API key not configured');
    }

    // Using sentence-transformers/all-MiniLM-L6-v2 (384 dimensions, fast, good quality)
    const response = await client.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text
    });

    // The response is already an array of numbers (the embedding vector)
    return response;
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    throw new Error('Failed to generate embedding: ' + error.message);
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * @param {Array<string>} texts - Array of texts to generate embeddings for
 * @param {number} batchDelay - Delay between batches in ms (to respect rate limits)
 * @returns {Promise<Array<Array<number>>>} Array of embedding vectors
 */
async function generateEmbeddingsBatch(texts, batchDelay = 1000) {
  const embeddings = [];
  
  console.log(`🔢 Generating embeddings for ${texts.length} chunks...`);
  
  for (let i = 0; i < texts.length; i++) {
    try {
      const embedding = await generateEmbedding(texts[i]);
      embeddings.push(embedding);
      
      if ((i + 1) % 5 === 0) {
        console.log(`  Progress: ${i + 1}/${texts.length} embeddings generated`);
      }
      
      // Add delay to respect rate limits
      if (i < texts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    } catch (error) {
      console.error(`❌ Failed to generate embedding for chunk ${i}:`, error.message);
      // Push null for failed embeddings
      embeddings.push(null);
    }
  }
  
  console.log(`✅ Generated ${embeddings.filter(e => e !== null).length} embeddings`);
  
  return embeddings;
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} Cosine similarity score (0 to 1)
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Find most similar chunks to a query using cosine similarity
 * @param {Array<number>} queryEmbedding - Embedding vector of the query
 * @param {Array<{embedding: Array<number>, text: string, _id: any}>} chunks - Chunks with embeddings
 * @param {number} topK - Number of top results to return
 * @returns {Array<{chunk: object, similarity: number}>} Top K most similar chunks
 */
function findSimilarChunks(queryEmbedding, chunks, topK = 5) {
  const similarities = chunks
    .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
    .map(chunk => ({
      chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return similarities;
}

module.exports = {
  initializeHF,
  generateEmbedding,
  generateEmbeddingsBatch,
  cosineSimilarity,
  findSimilarChunks
};
