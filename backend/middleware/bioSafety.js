const Animal = require('../models/Animal');
const { ObjectId } = require('mongodb');

// Pillar B & C: Bio-Safety Gatekeeper Middleware
// This middleware enforces withdrawal periods before allowing marketplace listings

const checkBioSafety = async (req, res, next) => {
    try {
        const { animalId } = req.body;

        if (!animalId) {
            return res.status(400).json({
                success: false,
                error: 'Animal ID is required to verify bio-safety compliance'
            });
        }

        // Fetch the animal
        const animal = await Animal.findById(animalId);

        if (!animal) {
            return res.status(404).json({
                success: false,
                error: 'Animal not found'
            });
        }

        // Verify ownership
        if (animal.ownerId.toString() !== req.session.userId) {
            return res.status(403).json({
                success: false,
                error: 'You do not own this animal'
            });
        }

        // CRITICAL CHECK: Is the animal under withdrawal lock?
        if (animal.status === 'WITHDRAWAL_LOCK') {
            // Double-check the date (in case the lock should have expired)
            const now = new Date();

            if (now < animal.withdrawalEndsAt) {
                // REJECT THE REQUEST - Animal is still locked
                const daysRemaining = Math.ceil((animal.withdrawalEndsAt - now) / (1000 * 60 * 60 * 24));

                return res.status(403).json({
                    success: false,
                    error: `CRITICAL: ${animal.tagId} is under medical withdrawal period.`,
                    details: `This animal cannot be used for production for ${daysRemaining} more day(s).`,
                    withdrawalEndsAt: animal.withdrawalEndsAt,
                    blocked: true
                });
            } else {
                // Auto-unlock if the withdrawal period has passed
                await Animal.updateStatus(animalId, 'HEALTHY', null);
                console.log(`✅ Auto-unlocked animal ${animal.tagId} - withdrawal period expired`);
            }
        }

        // Additional check for quarantine
        if (animal.status === 'QUARANTINE') {
            return res.status(403).json({
                success: false,
                error: `Animal ${animal.tagId} is currently in QUARANTINE and cannot be used for production.`,
                blocked: true
            });
        }

        // SUCCESS: Animal is HEALTHY and verified safe
        req.body.isVerifiedSafe = true;
        req.verifiedAnimal = animal; // Attach animal data for route handler

        next();

    } catch (error) {
        console.error('Bio-safety check error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to verify bio-safety compliance'
        });
    }
};

// Optional: Middleware to auto-unlock expired animals on any request
const autoUnlockExpired = async (req, res, next) => {
    try {
        const unlockedCount = await Animal.checkAndUnlockExpired();
        if (unlockedCount > 0) {
            console.log(`✅ Auto-unlocked ${unlockedCount} animal(s) with expired withdrawal periods`);
        }
    } catch (error) {
        console.error('Auto-unlock error:', error);
    }
    next();
};

module.exports = {
    checkBioSafety,
    autoUnlockExpired
};
