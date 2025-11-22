// Common medicines database with withdrawal periods (in days)
// This is a reference database that can be expanded

const commonMedicines = [
    { name: 'Amoxicillin', withdrawalDays: 14, category: 'Antibiotic' },
    { name: 'Oxytetracycline', withdrawalDays: 7, category: 'Antibiotic' },
    { name: 'Penicillin', withdrawalDays: 10, category: 'Antibiotic' },
    { name: 'Ceftiofur', withdrawalDays: 0, category: 'Antibiotic' },
    { name: 'Tylosin', withdrawalDays: 21, category: 'Antibiotic' },
    { name: 'Ivermectin', withdrawalDays: 35, category: 'Antiparasitic' },
    { name: 'Fenbendazole', withdrawalDays: 8, category: 'Antiparasitic' },
    { name: 'Dexamethasone', withdrawalDays: 3, category: 'Anti-inflammatory' },
    { name: 'Flunixin', withdrawalDays: 4, category: 'Anti-inflammatory' },
    { name: 'Oxytocin', withdrawalDays: 0, category: 'Hormone' },
    { name: 'Vitamin B Complex', withdrawalDays: 0, category: 'Supplement' },
    { name: 'Calcium Borogluconate', withdrawalDays: 0, category: 'Supplement' }
];

function getMedicineByName(name) {
    return commonMedicines.find(
        med => med.name.toLowerCase() === name.toLowerCase()
    );
}

function getAllMedicines() {
    return commonMedicines;
}

function getMedicinesByCategory(category) {
    return commonMedicines.filter(
        med => med.category.toLowerCase() === category.toLowerCase()
    );
}

module.exports = {
    commonMedicines,
    getMedicineByName,
    getAllMedicines,
    getMedicinesByCategory
};
