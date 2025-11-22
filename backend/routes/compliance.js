const express = require('express');
const router = express.Router();
const Compliance = require('../models/Compliance');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET: Compliance page
router.get('/compliance', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const checklist = Compliance.getChecklistItems();
        const todayCompliance = await Compliance.getTodayCompliance(req.session.userId);
        const averageScore = await Compliance.getAverageScore(req.session.userId, 7);

        res.render('farmer/compliance', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            checklist,
            completedItems: todayCompliance.completedItems || [],
            score: todayCompliance.score || 0,
            averageScore
        });
    } catch (error) {
        console.error('❌ Error loading compliance:', error);
        res.status(500).render('error', {
            user: {
                id: req.session.userId,
                name: req.session.userName,
                role: req.session.userRole
            },
            message: 'Failed to load compliance tracker'
        });
    }
});

// POST: Toggle checklist item
router.post('/api/compliance/toggle', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({
                success: false,
                error: 'Item ID is required'
            });
        }

        const result = await Compliance.toggleItem(req.session.userId, itemId);

        res.json({
            success: true,
            completedItems: result.completedItems,
            score: result.score
        });

    } catch (error) {
        console.error('❌ Error toggling compliance item:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update compliance'
        });
    }
});

// GET: Get compliance score (for API/dashboard)
router.get('/api/compliance/score', requireAuth, requireRole('farmer'), async (req, res) => {
    try {
        const todayCompliance = await Compliance.getTodayCompliance(req.session.userId);
        const averageScore = await Compliance.getAverageScore(req.session.userId, 7);

        res.json({
            success: true,
            todayScore: todayCompliance.score || 0,
            averageScore
        });

    } catch (error) {
        console.error('❌ Error getting compliance score:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get compliance score'
        });
    }
});

module.exports = router;
