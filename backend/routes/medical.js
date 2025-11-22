const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const MedicalLog = require('../models/MedicalLog');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getAllMedicines, getMedicineByName } = require('../utils/medicines');
const { calculateMedicationImpact, boundHealthScore } = require('../utils/healthScore');

// GET /animals/:id/add-medicine - Show medicine entry form
router.get('/animals/:id/add-medicine', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).render('error', {
                user: { role: req.session.userRole },
                message: 'Animal not found'
            });
        }

        // Verify ownership
        if (animal.ownerId.toString() !== req.session.userId) {
            return res.status(403).render('error', {
                user: { role: req.session.userRole },
                message: 'Access denied'
            });
        }

        // Get list of common medicines
        const medicines = getAllMedicines();

        res.render('farmer/add-medicine', {
            user: { role: req.session.userRole, name: req.session.userName },
            animal,
            medicines,
            error: null
        });

    } catch (error) {
        console.error('Add medicine form error:', error);
        res.status(500).render('error', {
            user: { role: req.session.userRole },
            message: 'Failed to load form'
        });
    }
});

// POST /animals/:id/add-medicine - Add medical log (Pillar B Implementation)
router.post('/animals/:id/add-medicine', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { medicineName, dosage, withdrawalDays, notes, customMedicine } = req.body;

        const animal = await Animal.findById(req.params.id);

        if (!animal) {
            return res.status(404).json({ success: false, error: 'Animal not found' });
        }

        // Verify ownership
        if (animal.ownerId.toString() !== req.session.userId) {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }

        // Determine medicine details
        let finalMedicineName = medicineName;
        let finalWithdrawalDays = parseInt(withdrawalDays) || 0;

        // If using custom medicine name
        if (customMedicine && customMedicine.trim()) {
            finalMedicineName = customMedicine.trim();
        }

        // If medicine is from the database, get its withdrawal period
        const medicineData = getMedicineByName(medicineName);
        if (medicineData && !customMedicine) {
            finalWithdrawalDays = medicineData.withdrawalDays;
        }

        // PILLAR B: Calculate Safe Date
        const now = new Date();
        const safeDate = new Date(now);
        safeDate.setDate(safeDate.getDate() + finalWithdrawalDays);

        // Create medical log
        await MedicalLog.create({
            animalId: animal._id,
            medicineName: finalMedicineName,
            dosage: dosage || '',
            administeredAt: now,
            withdrawalDays: finalWithdrawalDays,
            notes: notes || ''
        });

        // PILLAR B: Update animal status if withdrawal period > 0
        if (finalWithdrawalDays > 0) {
            await Animal.updateStatus(animal._id, 'WITHDRAWAL_LOCK', safeDate);
            console.log(`🔒 Animal ${animal.tagId} locked until ${safeDate.toLocaleDateString()}`);
        }

        // Update health score
        const healthImpact = calculateMedicationImpact(finalWithdrawalDays);
        const newHealthScore = boundHealthScore(animal.healthScore - healthImpact);
        await Animal.updateHealthScore(animal._id, newHealthScore);

        res.json({
            success: true,
            message: 'Medical log added successfully',
            withdrawalDays: finalWithdrawalDays,
            safeDate: safeDate,
            locked: finalWithdrawalDays > 0
        });

    } catch (error) {
        console.error('Add medicine error:', error);
        res.status(500).json({ success: false, error: 'Failed to add medical log' });
    }
});

module.exports = router;
