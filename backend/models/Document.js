const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

/**
 * Create a new document record
 */
async function createDocument(documentData) {
  const db = getDB();
  const result = await db.collection('documents').insertOne({
    ...documentData,
    uploadedAt: new Date()
  });
  return result.insertedId;
}

/**
 * Get document by ID
 */
async function getDocumentById(documentId) {
  const db = getDB();
  return await db.collection('documents').findOne({
    _id: new ObjectId(documentId)
  });
}

/**
 * Get all documents for a user
 */
async function getDocumentsByUser(userId) {
  const db = getDB();
  // Handle both string IDs (like 'SYSTEM') and ObjectIds
  const query = typeof userId === 'string' && userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId)
    ? { uploadedBy: new ObjectId(userId) }
    : { uploadedBy: userId };
  
  return await db.collection('documents').find(query).sort({ uploadedAt: -1 }).toArray();
}

/**
 * Delete document by ID
 */
async function deleteDocument(documentId) {
  const db = getDB();
  const result = await db.collection('documents').deleteOne({
    _id: new ObjectId(documentId)
  });
  return result.deletedCount > 0;
}

/**
 * Update document metadata
 */
async function updateDocument(documentId, updates) {
  const db = getDB();
  const result = await db.collection('documents').updateOne(
    { _id: new ObjectId(documentId) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

/**
 * Get all documents (admin function)
 */
async function getAllDocuments() {
  const db = getDB();
  return await db.collection('documents').find({}).sort({ uploadedAt: -1 }).toArray();
}

module.exports = {
  createDocument,
  getDocumentById,
  getDocumentsByUser,
  deleteDocument,
  updateDocument,
  getAllDocuments
};
