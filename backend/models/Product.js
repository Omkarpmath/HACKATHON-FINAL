const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Product {
    static async create(productData) {
        const db = getDB();

        const product = {
            productType: productData.productType, // milk, ghee, cheese, etc.
            animalId: new ObjectId(productData.animalId),
            sellerId: new ObjectId(productData.sellerId),

            // Quantity-based pricing system
            totalQuantity: parseFloat(productData.totalQuantity) || 0,
            quantitySold: 0,
            unit: productData.unit || 'liters', // liters, kg, dozens
            pricePerUnit: parseFloat(productData.pricePerUnit) || 0,
            minOrderQuantity: parseFloat(productData.minOrderQuantity) || 1,

            description: productData.description || '',
            isVerifiedSafe: productData.isVerifiedSafe || false, // Set by bio-safety middleware
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('products').insertOne(product);
        return { ...product, _id: result.insertedId };
    }

    // Get available quantity (total - sold)
    static async getAvailableQuantity(id) {
        const product = await this.findById(id);
        if (!product) return 0;
        return product.totalQuantity - product.quantitySold;
    }

    // Update quantity after purchase
    static async updateQuantitySold(id, quantityPurchased) {
        const db = getDB();

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            {
                $inc: { quantitySold: quantityPurchased },
                $set: { updatedAt: new Date() }
            }
        );

        return result.modifiedCount > 0;
    }

    static async findById(id) {
        const db = getDB();
        return await db.collection('products').findOne({ _id: new ObjectId(id) });
    }

    static async findAll() {
        const db = getDB();
        return await db.collection('products')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
    }

    static async findBySeller(sellerId) {
        const db = getDB();
        return await db.collection('products')
            .find({ sellerId: new ObjectId(sellerId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    static async findVerifiedOnly() {
        const db = getDB();
        return await db.collection('products')
            .find({ isVerifiedSafe: true })
            .sort({ createdAt: -1 })
            .toArray();
    }

    static async updateById(id, updateData) {
        const db = getDB();
        updateData.updatedAt = new Date();

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        return result.modifiedCount > 0;
    }

    static async deleteById(id) {
        const db = getDB();
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Product;
