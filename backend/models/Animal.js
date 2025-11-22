const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Animal {
    static async create(animalData) {
        const db = getDB();

        const animal = {
            tagId: animalData.tagId,
            ownerId: new ObjectId(animalData.ownerId),
            species: animalData.species,
            breed: animalData.breed || '',
            geneticLineage: animalData.geneticLineage || '',
            dateOfBirth: animalData.dateOfBirth ? new Date(animalData.dateOfBirth) : null,

            // Pillar B: Bio-Safety State
            status: 'HEALTHY', // HEALTHY, WITHDRAWAL_LOCK, QUARANTINE
            withdrawalEndsAt: null,

            // Health Analytics
            healthScore: 100,

            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('animals').insertOne(animal);
        return { ...animal, _id: result.insertedId };
    }

    static async findById(id) {
        const db = getDB();
        return await db.collection('animals').findOne({ _id: new ObjectId(id) });
    }

    static async findByTagId(tagId) {
        const db = getDB();
        return await db.collection('animals').findOne({ tagId });
    }

    static async findByOwner(ownerId) {
        const db = getDB();
        return await db.collection('animals')
            .find({ ownerId: new ObjectId(ownerId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    static async updateById(id, updateData) {
        const db = getDB();
        updateData.updatedAt = new Date();

        const result = await db.collection('animals').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return result.modifiedCount > 0;
    }

    static async updateStatus(id, status, withdrawalEndsAt = null) {
        const db = getDB();

        const updateData = {
            status,
            withdrawalEndsAt,
            updatedAt: new Date()
        };

        const result = await db.collection('animals').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return result.modifiedCount > 0;
    }

    static async updateHealthScore(id, healthScore) {
        const db = getDB();

        // Ensure health score stays within bounds
        const boundedScore = Math.max(0, Math.min(100, healthScore));

        const result = await db.collection('animals').updateOne(
            { _id: new ObjectId(id) },
            { $set: { healthScore: boundedScore, updatedAt: new Date() } }
        );

        return result.modifiedCount > 0;
    }

    static async deleteById(id) {
        const db = getDB();

        // CASCADE DELETE: Delete all related products first
        await db.collection('products').deleteMany({ animalId: new ObjectId(id) });
        console.log(`\uD83D\uDDD1\uFE0F Cascade deleted products for animal ${id}`);

        // CASCADE DELETE: Delete all medical logs
        await db.collection('medicalLogs').deleteMany({ animalId: new ObjectId(id) });
        console.log(`\uD83D\uDDD1\uFE0F Cascade deleted medical logs for animal ${id}`);

        // Delete the animal itself
        const result = await db.collection('animals').deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    // Check and auto-unlock animals whose withdrawal period has expired
    static async checkAndUnlockExpired() {
        const db = getDB();
        const now = new Date();

        const result = await db.collection('animals').updateMany(
            {
                status: 'WITHDRAWAL_LOCK',
                withdrawalEndsAt: { $lte: now }
            },
            {
                $set: {
                    status: 'HEALTHY',
                    withdrawalEndsAt: null,
                    updatedAt: now
                }
            }
        );

        return result.modifiedCount;
    }
}

module.exports = Animal;
