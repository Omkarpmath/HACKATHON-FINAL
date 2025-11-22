const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

/**
 * Create a new chunk
 */
async function createChunk(chunkData) {
  const db = getDB();
  const result = await db.collection('chunks').insertOne({
    ...chunkData,
    createdAt: new Date()
  });
  return result.insertedId;
}

/**
 * Create multiple chunks in batch
 */
async function createChunksBatch(chunksArray) {
  const db = getDB();
  const result = await db.collection('chunks').insertMany(
    chunksArray.map(chunk => ({
      ...chunk,
      createdAt: new Date()
    }))
  );
  return result.insertedIds;
}

/**
 * Get all chunks for a document
 */
async function getChunksByDocument(documentId) {
  const db = getDB();
  return await db.collection('chunks').find({
    documentId: new ObjectId(documentId)
  }).sort({ chunkIndex: 1 }).toArray();
}

/**
 * Get all chunks (for RAG search across all documents)
 */
async function getAllChunks() {
  const db = getDB();
  return await db.collection('chunks').find({}).toArray();
}

/**
 * Get chunks by user (all chunks from user's documents)
 */
async function getChunksByUser(userId) {
  const db = getDB();
  
  // First get all document IDs for this user
  const documents = await db.collection('documents').find({
    uploadedBy: new ObjectId(userId)
  }).project({ _id: 1 }).toArray();
  
  const documentIds = documents.map(doc => doc._id);
  
  // Then get all chunks for these documents
  return await db.collection('chunks').find({
    documentId: { $in: documentIds }
  }).toArray();
}

/**
 * Delete all chunks for a document
 */
async function deleteChunksByDocument(documentId) {
  const db = getDB();
  const result = await db.collection('chunks').deleteMany({
    documentId: new ObjectId(documentId)
  });
  return result.deletedCount;
}

/**
 * Get chunk by ID
 */
async function getChunkById(chunkId) {
  const db = getDB();
  return await db.collection('chunks').findOne({
    _id: new ObjectId(chunkId)
  });
}

/**
 * Update chunk
 */
async function updateChunk(chunkId, updates) {
  const db = getDB();
  const result = await db.collection('chunks').updateOne(
    { _id: new ObjectId(chunkId) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

/**
 * Count chunks for a document
 */
async function countChunksByDocument(documentId) {
  const db = getDB();
  return await db.collection('chunks').countDocuments({
    documentId: new ObjectId(documentId)
  });
}

module.exports = {
  createChunk,
  createChunksBatch,
  getChunksByDocument,
  getAllChunks,
  getChunksByUser,
  deleteChunksByDocument,
  getChunkById,
  updateChunk,
  countChunksByDocument
};
