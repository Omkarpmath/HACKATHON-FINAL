const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const {
    getMedicinesBySpecies,
    getMedicineById,
    searchByTreatment,
    getMedicineCategories,
    calculateDosage
} = require('../utils/veterinaryGuide');

// GET: Medicine guide page (view all medicines for a species)
router.get('/medicine-guide', requireAuth, requireRole('farmer'), (req, res) => {
    const species = req.query.species || 'cattle';
    const searchQuery = req.query.search || '';
    const disease = req.query.disease || '';

    let medicines = getMedicinesBySpecies(species);

    // Filter by search query if provided
    if (searchQuery) {
        medicines = searchByTreatment(species, searchQuery);
    }

    // Filter by disease if coming from diagnosis
    if (disease) {
        medicines = searchByTreatment(species, disease);
    }

    const categories = getMedicineCategories(species);

    res.render('farmer/medicine-guide', {
        user: {
            id: req.session.userId,
            name: req.session.userName,
            role: req.session.userRole
        },
        species,
        medicines,
        searchQuery,
        disease  // Pass disease to template
    });
});

// GET: Detailed medicine information
router.get('/medicine/:species/:medicineId', requireAuth, requireRole('farmer'), (req, res) => {
    const { species, medicineId } = req.params;
    const medicine = getMedicineById(species, medicineId);

    if (!medicine) {
        return res.status(404).render('error', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            error: 'Medicine not found'
        });
    }

    res.render('farmer/medicine-detail', {
        user: {
            id: req.session.userId,
            name: req.session.userName,
            role: req.session.userRole
        },
        species,
        medicine
    });
});

// POST: Calculate dosage for specific animal
router.post('/medicine/calculate-dosage', requireAuth, requireRole('farmer'), (req, res) => {
    try {
        const { species, medicineId, weight } = req.body;

        if (!species || !medicineId || !weight) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const weightNum = parseFloat(weight);
        if (weightNum <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid weight'
            });
        }

        const dosageInfo = calculateDosage(species, medicineId, weightNum);

        if (!dosageInfo) {
            return res.status(404).json({
                success: false,
                error: 'Medicine not found or dosage calculation not available'
            });
        }

        res.json({
            success: true,
            dosageInfo
        });

    } catch (error) {
        console.error('❌ Error calculating dosage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate dosage'
        });
    }
});

// API: Search medicines by treatment
router.get('/api/medicines/search', requireAuth, requireRole('farmer'), (req, res) => {
    const { species, treatment } = req.query;

    if (!species || !treatment) {
        return res.status(400).json({
            success: false,
            error: 'Species and treatment query required'
        });
    }

    const results = searchByTreatment(species, treatment);

    res.json({
        success: true,
        results
    });
});

module.exports = router;
