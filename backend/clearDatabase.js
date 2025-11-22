#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Clears all data from the JeevBandhu database
 * USE WITH CAUTION - THIS WILL DELETE ALL DATA!
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + '/.env' });

async function clearDatabase() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env file');
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');

        const db = client.db();

        // List all collections to clear
        const collections = [
            'users',
            'animals',
            'medicalLogs',
            'products',
            'orders'
        ];

        console.log('\n🗑️  Starting database cleanup...\n');

        for (const collectionName of collections) {
            try {
                const result = await db.collection(collectionName).deleteMany({});
                console.log(`✅ Cleared ${collectionName}: ${result.deletedCount} documents deleted`);
            } catch (error) {
                console.log(`⚠️  Collection ${collectionName} might not exist yet - skipping`);
            }
        }

        console.log('\n✅ Database cleanup complete!\n');
        console.log('All user data, animals, products, orders, and medical logs have been deleted.');
        console.log('The database is now clean and ready for fresh data.\n');

    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await client.close();
        console.log('📤 Disconnected from MongoDB');
    }
}

// Run the cleanup
clearDatabase();
