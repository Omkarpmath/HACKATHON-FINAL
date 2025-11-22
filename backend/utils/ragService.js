const { HfInference } = require('@huggingface/inference');
const { generateEmbedding, findSimilarChunks } = require('./embeddingService');

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
 * Build a context-aware prompt for RAG
 * @param {string} question - User's question
 * @param {Array<{text: string}>} relevantChunks - Most relevant text chunks
 * @returns {string} Formatted prompt
 */
function buildRAGPrompt(question, relevantChunks) {
  const context = relevantChunks
    .map((chunk, idx) => `[Context ${idx + 1}]\n${chunk.text}`)
    .join('\n\n');

  const prompt = `You are a helpful AI assistant specialized in livestock health and veterinary care. Use the provided context to answer the user's question accurately and concisely.

Context from documents:
${context}

User Question: ${question}

Instructions:
- Answer based ONLY on the information provided in the context above
- If the context doesn't contain enough information to answer the question, say so clearly
- Be specific and cite relevant details from the context
- Keep your answer clear and practical for farmers
- If discussing medications or treatments, emphasize consulting a veterinarian for specific cases

Answer:`;

  return prompt;
}

/**
 * Generate answer using RAG (Retrieval Augmented Generation)
 * @param {string} question - User's question
 * @param {Array<object>} allChunks - All available chunks with embeddings
 * @param {number} topK - Number of chunks to retrieve
 * @returns {Promise<{answer: string, sources: Array}>} Generated answer and source chunks
 */
async function generateRAGAnswer(question, allChunks, topK = 3) {
  try {
    console.log('🔍 Processing question:', question);

    // Step 1: Generate embedding for the question
    console.log('🔢 Generating question embedding...');
    const questionEmbedding = await generateEmbedding(question);

    // Step 2: Find most relevant chunks
    console.log('🎯 Finding relevant context...');
    const similarChunks = findSimilarChunks(questionEmbedding, allChunks, topK);

    if (similarChunks.length === 0) {
      return {
        answer: "I don't have enough information in the uploaded documents to answer this question. Please make sure you've uploaded relevant documents.",
        sources: []
      };
    }

    console.log(`✅ Found ${similarChunks.length} relevant chunks (similarity scores: ${similarChunks.map(s => s.similarity.toFixed(3)).join(', ')})`);

    // Step 3: Build prompt with context
    const relevantTexts = similarChunks.map(s => ({ text: s.chunk.text }));
    const prompt = buildRAGPrompt(question, relevantTexts);

    // Step 4: Generate answer using LLM
    console.log('🤖 Generating answer with AI...');
    const client = initializeHF();
    
    if (!client) {
      throw new Error('Hugging Face API key not configured');
    }

    let answer = '';
    
    try {
      // Using Mistral-7B-Instruct for good quality responses
      const stream = await client.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      });

      answer = stream.generated_text.trim();
    } catch (error) {
      // Fallback to a different model if Mistral fails
      console.warn('⚠️ Mistral model failed, trying alternative...');
      try {
        const stream = await client.textGeneration({
          model: 'google/flan-t5-large',
          inputs: `Answer this question based on the context.\n\nContext: ${relevantTexts.map(t => t.text).join(' ')}\n\nQuestion: ${question}\n\nAnswer:`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7
          }
        });
        answer = stream.generated_text.trim();
      } catch (fallbackError) {
        throw new Error('Both primary and fallback models failed');
      }
    }

    console.log('✅ Answer generated successfully');

    // Return answer with source information
    return {
      answer,
      sources: similarChunks.map(s => ({
        text: s.chunk.text.substring(0, 200) + '...',
        similarity: s.similarity,
        chunkId: s.chunk._id
      }))
    };

  } catch (error) {
    console.error('❌ Error generating RAG answer:', error);
    throw new Error('Failed to generate answer: ' + error.message);
  }
}

/**
 * Stream answer generation (for real-time responses)
 * Note: This is a simplified version - actual streaming requires more complex setup
 * @param {string} question - User's question
 * @param {Array<object>} allChunks - All available chunks with embeddings
 * @param {number} topK - Number of chunks to retrieve
 * @returns {Promise<AsyncGenerator>} Stream of answer tokens
 */
async function* streamRAGAnswer(question, allChunks, topK = 3) {
  try {
    // Generate embedding and find relevant chunks
    const questionEmbedding = await generateEmbedding(question);
    const similarChunks = findSimilarChunks(questionEmbedding, allChunks, topK);

    if (similarChunks.length === 0) {
      yield "I don't have enough information to answer this question.";
      return;
    }

    const relevantTexts = similarChunks.map(s => ({ text: s.chunk.text }));
    const prompt = buildRAGPrompt(question, relevantTexts);

    const client = initializeHF();
    
    // For now, we'll just yield the complete answer
    // True streaming requires Hugging Face Inference Endpoints
    const result = await generateRAGAnswer(question, allChunks, topK);
    yield result.answer;

  } catch (error) {
    yield `Error: ${error.message}`;
  }
}

/**
 * Diagnose disease based on symptoms using RAG
 * @param {Array<string>} symptoms - Array of symptom descriptions
 * @param {Array<object>} allChunks - All available chunks with embeddings
 * @returns {Promise<{disease: string, confidence: string, explanation: string, treatment: string}>}
 */
async function diagnoseDiseaseFromSymptoms(symptoms, allChunks) {
  try {
    console.log('🔍 Diagnosing disease from symptoms:', symptoms);

    // Build diagnostic question
    const symptomList = symptoms.map(s => `- ${s}`).join('\n');
    const diagnosticQuery = `A cattle is showing these symptoms:\n${symptomList}\n\nWhat disease does it likely have?`;

    // Step 1: Generate embedding for the diagnostic query
    console.log('🔢 Generating query embedding...');
    const queryEmbedding = await generateEmbedding(diagnosticQuery);

    // Step 2: Find most relevant chunks
    console.log('🎯 Finding relevant medical knowledge...');
    const similarChunks = findSimilarChunks(queryEmbedding, allChunks, 5); // Get top 5 chunks

    if (similarChunks.length === 0) {
      return {
        disease: 'Unknown',
        confidence: 'Low',
        explanation: 'Insufficient information in knowledge base to diagnose based on these symptoms.',
        treatment: 'General care'
      };
    }

    console.log(`✅ Found ${similarChunks.length} relevant knowledge chunks`);

    // Step 3: Build specialized diagnostic prompt
    const context = similarChunks
      .map((chunk, idx) => `[Medical Reference ${idx + 1}]\n${chunk.chunk.text}`)
      .join('\n\n');

    const diagnosticPrompt = `You are a veterinary AI assistant specializing in livestock health. Based on the medical knowledge provided, diagnose the most likely disease.

Medical Knowledge Base:
${context}

Patient Symptoms:
${symptomList}

Provide a diagnosis in EXACTLY this format:
DISEASE: [specific disease name]
CONFIDENCE: [High/Medium/Low]
EXPLANATION: [2-3 sentences explaining why these symptoms match this disease]
TREATMENT: [primary treatment approach or medicine category]

Be specific with the disease name. Use medical terminology where appropriate.`;

    // Step 4: Generate diagnosis using LLM
    console.log('🤖 Generating diagnosis...');
    const client = initializeHF();
    
    if (!client) {
      throw new Error('Hugging Face API key not configured');
    }

    let response = '';
    
    try {
      // Use Zephyr which is reliably available on free tier
      const result = await client.textGeneration({
        model: 'HuggingFaceH4/zephyr-7b-beta',
        inputs: diagnosticPrompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.3,
          top_p: 0.9,
          return_full_text: false
        }
      });

      response = result.generated_text.trim();
    } catch (error) {
      console.warn('⚠️ Primary model failed, trying GPT-2 as fallback...');
      // GPT-2 is always available but gives simpler responses
      try {
        const simplePrompt = `Based on these livestock symptoms: ${symptoms.join(', ')}\n\nDiagnose the disease and provide treatment.\n\nDISEASE:`;
        const result = await client.textGeneration({
          model: 'gpt2',
          inputs: simplePrompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7
          }
        });
        response = `DISEASE: ${result.generated_text.trim()}\nCONFIDENCE: Medium\nEXPLANATION: Based on the symptoms provided.\nTREATMENT: Consult veterinarian`;
      } catch (fallbackError) {
        console.error('Both models failed:', fallbackError);
        // Return a basic response based on symptoms
        response = `DISEASE: Possible infection or parasitic condition\nCONFIDENCE: Low\nEXPLANATION: Multiple symptoms detected: ${symptoms.join(', ')}. Professional veterinary diagnosis recommended.\nTREATMENT: Veterinary consultation required`;
      }
    }

    console.log('✅ Diagnosis generated');

    // Step 5: Parse the structured response
    const diseaseMatch = response.match(/DISEASE:\s*(.+?)(?:\n|$)/i);
    const confidenceMatch = response.match(/CONFIDENCE:\s*(.+?)(?:\n|$)/i);
    const explanationMatch = response.match(/EXPLANATION:\s*(.+?)(?:\n|TREATMENT|$)/is);
    const treatmentMatch = response.match(/TREATMENT:\s*(.+?)$/is);

    const diagnosis = {
      disease: diseaseMatch ? diseaseMatch[1].trim() : 'Unable to diagnose',
      confidence: confidenceMatch ? confidenceMatch[1].trim() : 'Low',
      explanation: explanationMatch ? explanationMatch[1].trim() : response,
      treatment: treatmentMatch ? treatmentMatch[1].trim() : 'Consult veterinarian',
      rawResponse: response
    };

    console.log('📋 Diagnosis:', diagnosis.disease, `(${diagnosis.confidence} confidence)`);

    return diagnosis;

  } catch (error) {
    console.error('❌ Error diagnosing disease:', error);
    throw new Error('Failed to diagnose disease: ' + error.message);
  }
}

module.exports = {
  buildRAGPrompt,
  generateRAGAnswer,
  streamRAGAnswer,
  diagnoseDiseaseFromSymptoms
};
