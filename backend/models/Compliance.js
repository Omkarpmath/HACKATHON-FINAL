const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

class Compliance {
    // Define compliance checklist items
    static getChecklistItems() {
        return {
            water: [
                { id: 'clean_tanks', name: 'Clean water tanks', frequency: 'Daily' },
                { id: 'check_quality', name: 'Check water quality', frequency: 'Weekly' }
            ],
            feed: [
                { id: 'check_feeders', name: 'Check feeders', frequency: 'Daily' },
                { id: 'inspect_feed', name: 'Inspect feed storage', frequency: 'Daily' },
                { id: 'clean_troughs', name: 'Clean feeding troughs', frequency: 'Weekly' }
            ],
            biosecurity: [
                { id: 'footbath', name: 'Footbath at entry', frequency: 'Daily' },
                { id: 'disinfect_equipment', name: 'Disinfect equipment', frequency: 'Weekly' },
                { id: 'pest_control', name: 'Pest control check', frequency: 'Weekly' },
                { id: 'visitor_log', name: 'Maintain visitor log', frequency: 'Daily' }
            ],
            health: [
                { id: 'check_animals', name: 'Visual health check of all animals', frequency: 'Daily' },
                { id: 'temperature_log', name: 'Record temperature (if applicable)', frequency: 'Daily' },
                { id: 'isolate_sick', name: 'Check isolation areas', frequency: 'Daily' }
            ]
        };
    }

    // Get or create today's compliance record for a farmer
    static async getTodayCompliance(farmerId) {
        const db = getDB();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let compliance = await db.collection('compliance').findOne({
            farmerId: new ObjectId(farmerId),
            date: today
        });

        if (!compliance) {
            // Create new compliance record for today
            compliance = {
                farmerId: new ObjectId(farmerId),
                date: today,
                completedItems: [],
                score: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const result = await db.collection('compliance').insertOne(compliance);
            compliance._id = result.insertedId;
        }

        return compliance;
    }

    // Toggle completion of a checklist item
    static async toggleItem(farmerId, itemId) {
        const db = getDB();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const compliance = await this.getTodayCompliance(farmerId);
        const completedItems = compliance.completedItems || [];
        const index = completedItems.indexOf(itemId);

        if (index > -1) {
            // Remove (uncheck)
            completedItems.splice(index, 1);
        } else {
            // Add (check)
            completedItems.push(itemId);
        }

        // Calculate total items
        const checklist = this.getChecklistItems();
        const totalItems = Object.values(checklist).reduce((sum, items) => sum + items.length, 0);
        const score = Math.round((completedItems.length / totalItems) * 100);

        await db.collection('compliance').updateOne(
            { _id: compliance._id },
            {
                $set: {
                    completedItems,
                    score,
                    updatedAt: new Date()
                }
            }
        );

        return { completedItems, score };
    }

    // Get compliance history for a farmer
    static async getHistory(farmerId, days = 7) {
        const db = getDB();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        return await db.collection('compliance')
            .find({
                farmerId: new ObjectId(farmerId),
                date: { $gte: startDate }
            })
            .sort({ date: -1 })
            .toArray();
    }

    // Get average compliance score
    static async getAverageScore(farmerId, days = 7) {
        const history = await this.getHistory(farmerId, days);
        if (history.length === 0) return 0;

        const totalScore = history.reduce((sum, record) => sum + (record.score || 0), 0);
        return Math.round(totalScore / history.length);
    }
}

module.exports = Compliance;
