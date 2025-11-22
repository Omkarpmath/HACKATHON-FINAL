const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Order {
    static async create(orderData) {
        const db = getDB();

        const order = {
            productId: new ObjectId(orderData.productId),
            buyerId: new ObjectId(orderData.buyerId),
            sellerId: new ObjectId(orderData.sellerId),

            // Order details
            productType: orderData.productType,
            quantity: parseFloat(orderData.quantity),
            unit: orderData.unit,
            pricePerUnit: parseFloat(orderData.pricePerUnit),
            totalPrice: parseFloat(orderData.totalPrice),

            // Animal traceability
            animalId: new ObjectId(orderData.animalId),
            animalTagId: orderData.animalTagId,

            // Order status
            status: 'pending', // pending, confirmed, delivered, cancelled

            // Payment information
            paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
            transactionId: orderData.transactionId || null,
            paymentStatus: orderData.paymentStatus || 'pending', // pending, completed, failed

            // Delivery information
            deliveryAddress: orderData.deliveryAddress || '',
            estimatedDeliveryDays: orderData.estimatedDeliveryDays || 5,

            // Timestamps
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('orders').insertOne(order);
        return { ...order, _id: result.insertedId };
    }

    static async findById(id) {
        const db = getDB();
        return await db.collection('orders').findOne({ _id: new ObjectId(id) });
    }

    // Find all orders by buyer
    static async findByBuyer(buyerId) {
        const db = getDB();
        return await db.collection('orders')
            .find({ buyerId: new ObjectId(buyerId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    // Find all orders (sales) by seller/farmer
    static async findBySeller(sellerId) {
        const db = getDB();
        return await db.collection('orders')
            .find({ sellerId: new ObjectId(sellerId) })
            .sort({ createdAt: -1 })
            .toArray();
    }

    // Update order status
    static async updateStatus(id, status) {
        const db = getDB();

        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Get sales statistics for a farmer
    static async getSalesStats(sellerId) {
        const db = getDB();

        const stats = await db.collection('orders').aggregate([
            { $match: { sellerId: new ObjectId(sellerId) } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                    totalOrders: { $sum: 1 },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    }
                }
            }
        ]).toArray();

        return stats[0] || { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 };
    }

    static async deleteById(id) {
        const db = getDB();
        const result = await db.collection('orders').deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = Order;
