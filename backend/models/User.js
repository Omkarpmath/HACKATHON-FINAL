const bcrypt = require('bcrypt');
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class User {
    static async create(userData) {
        const db = getDB();
        const { name, email, password, role } = userData;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role, // 'farmer' or 'buyer'
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(user);
        return { ...user, _id: result.insertedId };
    }

    static async findByEmail(email) {
        const db = getDB();
        return await db.collection('users').findOne({ email: email.toLowerCase() });
    }

    static async findById(id) {
        const db = getDB();
        return await db.collection('users').findOne({ _id: new ObjectId(id) });
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async updateById(id, updateData) {
        const db = getDB();
        updateData.updatedAt = new Date();

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return result.modifiedCount > 0;
    }
}

module.exports = User;
