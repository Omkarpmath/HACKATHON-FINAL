// Health Score Calculation Utilities

/**
 * Calculate health score deduction based on medication severity
 * @param {number} withdrawalDays - Number of withdrawal days for the medicine
 * @returns {number} - Points to deduct from health score
 */
function calculateMedicationImpact(withdrawalDays) {
    // More severe medications (longer withdrawal) have higher impact
    // Base deduction: 5-20 points depending on severity

    if (withdrawalDays === 0) return 2; // Minimal impact
    if (withdrawalDays <= 3) return 5;
    if (withdrawalDays <= 7) return 10;
    if (withdrawalDays <= 14) return 15;
    return 20; // Severe medication (> 14 days)
}

/**
 * Calculate health score recovery for healthy intervals
 * @param {number} daysSinceLastTreatment - Days since last medication
 * @returns {number} - Points to add to health score
 */
function calculateHealthRecovery(daysSinceLastTreatment) {
    // Animals recover health score gradually
    // ~1 point per week of healthy intervals

    if (daysSinceLastTreatment < 7) return 0;
    if (daysSinceLastTreatment < 30) return 5;
    if (daysSinceLastTreatment < 90) return 10;
    return 15; // Fully recovered after 3+ months
}

/**
 * Ensure health score stays within valid bounds
 * @param {number} score - Current score
 * @returns {number} - Bounded score (0-100)
 */
function boundHealthScore(score) {
    return Math.max(0, Math.min(100, score));
}

module.exports = {
    calculateMedicationImpact,
    calculateHealthRecovery,
    boundHealthScore
};
