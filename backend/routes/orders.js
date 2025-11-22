const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Animal = require('../models/Animal');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET: My Orders (Buyer view)
router.get('/my-orders', requireAuth, requireRole('buyer'), async (req, res) => {
    try {
        const orders = await Order.findByBuyer(req.session.userId);

        // Enrich orders with product and animal details
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const product = await Product.findById(order.productId);
            const animal = await Animal.findById(order.animalId);
            return { ...order, product, animal };
        }));

        res.render('marketplace/my-orders', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            orders: enrichedOrders
        });
    } catch (error) {
        console.error('❌ Error fetching buyer orders:', error);
        res.status(500).render('error', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            error: 'Failed to load orders'
        });
    }
});

// GET: Sales (Farmer view)
router.get('/sales', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const orders = await Order.findBySeller(req.session.userId);
        const stats = await Order.getSalesStats(req.session.userId);

        // Enrich orders with product and animal details
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            const product = await Product.findById(order.productId);
            const animal = await Animal.findById(order.animalId);
            return { ...order, product, animal };
        }));

        res.render('farmer/sales', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            orders: enrichedOrders,
            stats
        });
    } catch (error) {
        console.error('❌ Error fetching farmer sales:', error);
        res.status(500).render('error', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            error: 'Failed to load sales'
        });
    }
});

// POST: Create Order
router.post('/create', requireAuth, requireRole('buyer'), async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate inputs
        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                error: 'Product ID and quantity are required'
            });
        }

        const quantityNum = parseFloat(quantity);
        if (quantityNum <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid quantity'
            });
        }

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Check minimum order quantity
        if (quantityNum < product.minOrderQuantity) {
            return res.status(400).json({
                success: false,
                error: `Minimum order quantity is ${product.minOrderQuantity} ${product.unit}`
            });
        }

        // Check available quantity
        const availableQty = product.totalQuantity - product.quantitySold;
        if (quantityNum > availableQty) {
            return res.status(400).json({
                success: false,
                error: `Only ${availableQty} ${product.unit} available`
            });
        }

        // Get animal details for traceability
        const animal = await Animal.findById(product.animalId);
        if (!animal) {
            return res.status(500).json({
                success: false,
                error: 'Animal traceability error'
            });
        }

        // Calculate total price
        const totalPrice = quantityNum * product.pricePerUnit;

        // Get payment and delivery information from request
        const { paymentMethod, deliveryAddress } = req.body;

        // Validate delivery address
        if (!deliveryAddress || deliveryAddress.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Delivery address is required'
            });
        }

        // Calculate estimated delivery days (simple logic - can be enhanced later)
        const estimatedDeliveryDays = 5; // Default 5 days

        // Create order
        const orderData = {
            productId: product._id,
            buyerId: req.session.userId,
            sellerId: product.sellerId,
            productType: product.productType,
            quantity: quantityNum,
            unit: product.unit,
            pricePerUnit: product.pricePerUnit,
            totalPrice,
            animalId: animal._id,
            animalTagId: animal.tagId,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            deliveryAddress: deliveryAddress.trim(),
            estimatedDeliveryDays
        };

        const order = await Order.create(orderData);

        // Update product quantity sold
        await Product.updateQuantitySold(productId, quantityNum);

        console.log(`✅ Order created: ${order._id}`);
        res.json({
            success: true,
            message: 'Order placed successfully!',
            orderId: order._id,
            totalPrice
        });

    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order'
        });
    }
});

// POST: Update order status (Farmer only)
router.post('/:id/status', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        // Verify the order belongs to this seller
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        if (order.sellerId.toString() !== req.session.userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Update status
        await Order.updateStatus(id, status);

        console.log(`✅ Order ${id} status updated to ${status}`);
        res.json({
            success: true,
            message: `Order ${status}`
        });

    } catch (error) {
        console.error('❌ Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
});

module.exports = router;
