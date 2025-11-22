const { MongoClient } = require('mongodb');

let db = null;
let client = null;

async function connectDB() {
  try {
    if (db) {
      return db;
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 30000,
      retryWrites: true,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });

    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    db = client.db('jeevbandhu');

    // Create indexes
    await createIndexes();

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

async function createIndexes() {
  try {
    // User collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // Animal collection indexes
    await db.collection('animals').createIndex({ tagId: 1 }, { unique: true });
    await db.collection('animals').createIndex({ ownerId: 1 });

    // Medical logs indexes
    await db.collection('medicalLogs').createIndex({ animalId: 1 });

    // Products indexes
    await db.collection('products').createIndex({ sellerId: 1 });
    await db.collection('products').createIndex({ animalId: 1 });

    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('⚠️ Index creation warning:', error.message);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('✅ MongoDB connection closed');
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB
};
