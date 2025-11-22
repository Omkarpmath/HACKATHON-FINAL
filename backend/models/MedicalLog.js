const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class MedicalLog {
    static async create(logData) {
        const db = getDB();

        const log = {
            animalId: new ObjectId(logData.animalId),
            medicineName: logData.medicineName,
            dosage: logData.dosage || '',
            administeredAt: logData.administeredAt || new Date(),
            withdrawalDays: logData.withdrawalDays || 0,
            notes: logData.notes || '',
            createdAt: new Date()
        };

        const result = await db.collection('medicalLogs').insertOne(log);
        return { ...log, _id: result.insertedId };
    }

    static async findById(id) {
        const db = getDB();
        return await db.collection('medicalLogs').findOne({ _id: new ObjectId(id) });
    }

    static async findByAnimal(animalId) {
        const db = getDB();
        return await db.collection('medicalLogs')
            .find({ animalId: new ObjectId(animalId) })
            .sort({ administeredAt: -1 })
            .toArray();
    }

    static async findRecent(animalId, limit = 10) {
        const db = getDB();
        return await db.collection('medicalLogs')
            .find({ animalId: new ObjectId(animalId) })
            .sort({ administeredAt: -1 })
            .limit(limit)
            .toArray();
    }

    static async countByAnimal(animalId) {
        const db = getDB();
        return await db.collection('medicalLogs')
            .countDocuments({ animalId: new ObjectId(animalId) });
    }
}

module.exports = MedicalLog;
