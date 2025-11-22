const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Animal = require('../models/Animal');
const MedicalLog = require('../models/MedicalLog');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const { checkBioSafety } = require('../middleware/bioSafety');

// GET /marketplace - Browse products (accessible to all authenticated users)
router.get('/marketplace', requireAuth, async (req, res) => {
    try {
        // Get all verified products
        const products = await Product.findVerifiedOnly();

        // Enrich products with animal and seller data
        const enrichedProducts = await Promise.all(
            products.map(async (product) => {
                const animal = await Animal.findById(product.animalId);
                const seller = await User.findById(product.sellerId);

                return {
                    ...product,
                    animal: animal ? {
                        tagId: animal.tagId,
                        species: animal.species,
                        breed: animal.breed,
                        healthScore: animal.healthScore
                    } : null,
                    seller: seller ? {
                        name: seller.name
                    } : null
                };
            })
        );

        res.render('marketplace/index', {
            user: { role: req.session.userRole, name: req.session.userName },
            products: enrichedProducts
        });

    } catch (error) {
        console.error('Marketplace error:', error);
        res.status(500).render('error', {
            user: { role: req.session.userRole },
            message: 'Failed to load marketplace'
        });
    }
});

// GET /list-product - Show product listing form (farmers only)
router.get('/list-product', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        // Get only HEALTHY animals owned by this farmer
        const allAnimals = await Animal.findByOwner(req.session.userId);
        const healthyAnimals = allAnimals.filter(a => a.status === 'HEALTHY');

        res.render('farmer/list-product', {
            user: { role: req.session.userRole, name: req.session.userName },
            animals: healthyAnimals,
            error: null
        });

    } catch (error) {
        console.error('List product form error:', error);
        res.status(500).render('error', {
            user: { role: req.session.userRole },
            message: 'Failed to load form'
        });
    }
});

// POST /list-product - Create product listing (PILLAR C: Bio-Safety Gate)
router.post('/list-product',
    requireAuth,
    requireRole('farmer'),
    checkBioSafety, // CRITICAL: Bio-safety middleware
    async (req, res) => {
        try {
            const { productType, animalId, totalQuantity, unit, pricePerUnit, minOrderQuantity, description } = req.body;

            // Validation for new quantity-based system
            if (!productType || !animalId || !totalQuantity || !pricePerUnit) {
                return res.status(400).json({
                    success: false,
                    error: 'Product type, animal, total quantity, and price per unit are required'
                });
            }

            // The animal has already been verified by checkBioSafety middleware
            // req.body.isVerifiedSafe is set to true by the middleware

            const product = await Product.create({
                productType,
                animalId,
                sellerId: req.session.userId,
                totalQuantity: parseFloat(totalQuantity),
                quantitySold: 0,
                unit: unit || 'liters',
                pricePerUnit: parseFloat(pricePerUnit),
                minOrderQuantity: parseFloat(minOrderQuantity) || 1,
                description: description || '',
                isVerifiedSafe: req.body.isVerifiedSafe // true from middleware
            });

            console.log(`✅ Product listed - ${productType} from verified animal`);

            res.json({
                success: true,
                message: 'Product listed successfully',
                productId: product._id
            });

        } catch (error) {
            console.error('List product error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to list product'
            });
        }
    }
);


// GET /my-products - View farmer's own product listings
router.get('/my-products', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const products = await Product.findBySeller(req.session.userId);

        // Enrich with animal data
        const enrichedProducts = await Promise.all(
            products.map(async (product) => {
                const animal = await Animal.findById(product.animalId);
                return {
                    ...product,
                    animal: animal ? {
                        tagId: animal.tagId,
                        species: animal.species
                    } : null
                };
            })
        );

        res.render('farmer/my-products', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            products: enrichedProducts
        });

    } catch (error) {
        console.error('My products error:', error);
        res.status(500).render('error', {
            user: { role: req.session.userRole },
            message: 'Failed to load your products'
        });
    }
});

module.exports = router;

// DELETE /products/:id - Delete a product (farmer only)
router.delete('/products/:id', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const productId = req.params.id;

        // Get product to verify ownership
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Verify the farmer owns this product
        if (product.sellerId.toString() !== req.session.userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized - you can only delete your own products'
            });
        }

        // Delete the product
        await Product.deleteById(productId);

        console.log(`✅ Product deleted: ${productId}`);
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
});
