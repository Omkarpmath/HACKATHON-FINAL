/**
 * Comprehensive Veterinary Medicine Guide
 * Research-based dosage, withdrawal periods, and treatment guidelines
 * for common livestock medications
 */

const medicineDatabase = {
    // CATTLE & BUFFALO MEDICINES
    cattle: [
        {
            id: 'oxytetracycline',
            name: 'Oxytetracycline (LA)',
            type: 'Antibiotic',
            category: 'Broad Spectrum Antibiotic',
            treatments: ['Respiratory infections', 'Mastitis', 'Foot rot', 'Metritis'],
            dosage: {
                amount: 20,
                unit: 'mg/kg',
                route: 'Intramuscular (IM) injection',
                frequency: 'Once daily for 3-5 days',
                calculation: (weightKg) => `${(weightKg * 20).toFixed(1)}mg (${((weightKg * 20) / 200).toFixed(1)}ml of 200mg/ml solution)`
            },
            withdrawalPeriod: {
                meat: 28,
                milk: 7
            },
            sideEffects: 'May cause injection site reactions, avoid IV administration',
            precautions: 'Do not use in animals with kidney disease. Store below 25°C.',
            contraindications: 'Not for use in animals with hypersensitivity to tetracyclines'
        },
        {
            id: 'penicillin-streptomycin',
            name: 'Penicillin + Streptomycin',
            type: 'Antibiotic Combination',
            category: 'Dual Action Antibiotic',
            treatments: ['Pneumonia', 'Septicemia', 'Wound infections', 'Acute mastitis'],
            dosage: {
                amount: 10000,
                unit: 'IU/kg (Penicillin)',
                route: 'Intramuscular (IM) injection',
                frequency: 'Every 12-24 hours for 3-5 days',
                calculation: (weightKg) => `${(weightKg * 10000).toFixed(0)} IU Penicillin + ${(weightKg * 10).toFixed(1)}mg Streptomycin`
            },
            withdrawalPeriod: {
                meat: 21,
                milk: 4
            },
            sideEffects: 'Rare allergic reactions, injection site swelling',
            precautions: 'Shake well before use. Complete full course even if symptoms improve.',
            contraindications: 'Avoid in animals with penicillin allergy'
        },
        {
            id: 'ivermectin',
            name: 'Ivermectin',
            type: 'Anti-parasitic',
            category: 'Endoparasiticide & Ectoparasiticide',
            treatments: ['Gastrointestinal worms', 'Lung worms', 'Lice', 'Mange', 'Ticks'],
            dosage: {
                amount: 0.2,
                unit: 'mg/kg',
                route: 'Subcutaneous (SC) injection or oral',
                frequency: 'Single dose, repeat after 14 days if needed',
                calculation: (weightKg) => `${(weightKg * 0.2).toFixed(1)}mg (${(weightKg * 0.2 / 10).toFixed(2)}ml of 1% solution)`
            },
            withdrawalPeriod: {
                meat: 35,
                milk: 28
            },
            sideEffects: 'Generally safe, rare cases of lethargy',
            precautions: 'Do not use in calves less than 6 weeks old. Not for IV use.',
            contraindications: 'Not for use in dairy cattle producing milk for human consumption (prefer albendazole for milking animals)'
        },
        {
            id: 'albendazole',
            name: 'Albendazole',
            type: 'Anti-parasitic',
            category: 'Broad Spectrum Anthelmintic',
            treatments: ['Roundworms', 'Tapeworms', 'Liver flukes', 'Lungworms'],
            dosage: {
                amount: 10,
                unit: 'mg/kg',
                route: 'Oral suspension',
                frequency: 'Single dose',
                calculation: (weightKg) => `${(weightKg * 10).toFixed(0)}mg (${(weightKg * 10 / 100).toFixed(1)}ml of 10% suspension)`
            },
            withdrawalPeriod: {
                meat: 14,
                milk: 3
            },
            sideEffects: 'Transient diarrhea in some animals',
            precautions: 'Not for use in first trimester of pregnancy. Give on empty stomach.',
            contraindications: 'Avoid in pregnant animals during first 45 days'
        },
        {
            id: 'meloxicam',
            name: 'Meloxicam',
            type: 'NSAID',
            category: 'Non-Steroidal Anti-Inflammatory',
            treatments: ['Pain relief', 'Fever', 'Inflammation', 'Lameness'],
            dosage: {
                amount: 0.5,
                unit: 'mg/kg',
                route: 'Subcutaneous (SC) or oral',
                frequency: 'Once daily for up to 5 days',
                calculation: (weightKg) => `${(weightKg * 0.5).toFixed(1)}mg (${(weightKg * 0.5 / 20).toFixed(2)}ml of 20mg/ml solution)`
            },
            withdrawalPeriod: {
                meat: 15,
                milk: 5
            },
            sideEffects: 'May cause gastrointestinal upset if used long-term',
            precautions: 'Ensure adequate hydration. Do not exceed recommended dose.',
            contraindications: 'Not for pregnant or lactating animals, or those with kidney/liver disease'
        },
        {
            id: 'enrofloxacin',
            name: 'Enrofloxacin',
            type: 'Antibiotic',
            category: 'Fluoroquinolone',
            treatments: ['Respiratory diseases', 'Urinary tract infections', 'Skin infections'],
            dosage: {
                amount: 5,
                unit: 'mg/kg',
                route: 'Subcutaneous (SC) or oral',
                frequency: 'Once daily for 3-5 days',
                calculation: (weightKg) => `${(weightKg * 5).toFixed(0)}mg (${(weightKg * 5 / 50).toFixed(1)}ml of 5% solution)`
            },
            withdrawalPeriod: {
                meat: 14,
                milk: 0 // Not approved for lactating dairy cattle
            },
            sideEffects: 'Rare CNS effects at high doses',
            precautions: 'Not for use in lactating dairy cattle. Complete full course.',
            contraindications: 'Do not use in growing calves due to cartilage effects'
        },
        {
            id: 'vitamin-ad3e',
            name: 'Vitamin AD3E Injectable',
            type: 'Vitamin Supplement',
            category: 'Nutritional Support',
            treatments: ['Vitamin deficiency', 'Immunity boost', 'Post-disease recovery', 'Stress management'],
            dosage: {
                amount: 1,
                unit: 'ml per 50 kg',
                route: 'Intramuscular (IM) injection',
                frequency: 'Every 2-4 weeks as needed',
                calculation: (weightKg) => `${(weightKg / 50).toFixed(1)}ml`
            },
            withdrawalPeriod: {
                meat: 0,
                milk: 0
            },
            sideEffects: 'Generally none, safe supplement',
            precautions: 'Do not exceed recommended dose. Hypervitaminosis possible.',
            contraindications: 'None known'
        },
        {
            id: 'calcium-borogluconate',
            name: 'Calcium Borogluconate',
            type: 'Mineral Supplement',
            category: 'Emergency Metabolic Treatment',
            treatments: ['Milk fever (Hypocalcemia)', 'Parturient paresis', 'Muscle tremors'],
            dosage: {
                amount: 1,
                unit: 'bottle (400-500ml)',
                route: 'Slow intravenous (IV) or subcutaneous',
                frequency: 'Single dose, monitor closely',
                calculation: (weightKg) => 'Standard 400-500ml bottle for adult cattle'
            },
            withdrawalPeriod: {
                meat: 0,
                milk: 0
            },
            sideEffects: 'Heart arrhythmia if given too fast IV',
            precautions: 'MUST administer IV very slowly (10-15 minutes). Monitor heart rate.',
            contraindications: 'None in emergency, but avoid if animal has heart disease'
        }
    ],

    // GOAT & SHEEP MEDICINES
    goat: [
        {
            id: 'oxytetracycline-goat',
            name: 'Oxytetracycline (LA)',
            type: 'Antibiotic',
            category: 'Broad Spectrum Antibiotic',
            treatments: ['Pneumonia', 'Enteritis', 'Foot rot', 'Conjunctivitis'],
            dosage: {
                amount: 20,
                unit: 'mg/kg',
                route: 'Intramuscular (IM) injection',
                frequency: 'Once daily for 3-5 days',
                calculation: (weightKg) => `${(weightKg * 20).toFixed(1)}mg (${((weightKg * 20) / 200).toFixed(2)}ml of 200mg/ml solution)`
            },
            withdrawalPeriod: {
                meat: 28,
                milk: 7
            },
            sideEffects: 'Injection site reactions possible',
            precautions: 'Higher metabolic rate in goats may require higher doses than cattle.',
            contraindications: 'Not for animals with kidney disease'
        },
        {
            id: 'levamisole',
            name: 'Levamisole',
            type: 'Anti-parasitic',
            category: 'Anthelmintic',
            treatments: ['Gastrointestinal roundworms', 'Lungworms'],
            dosage: {
                amount: 7.5,
                unit: 'mg/kg',
                route: 'Oral or subcutaneous',
                frequency: 'Single dose',
                calculation: (weightKg) => `${(weightKg * 7.5).toFixed(1)}mg (${(weightKg * 7.5 / 75).toFixed(2)}ml of 7.5% solution)`
            },
            withdrawalPeriod: {
                meat: 14,
                milk: 3
            },
            sideEffects: 'Transient salivation, muscle tremors',
            precautions: 'Do not exceed recommended dose. Toxic at 3x dose.',
            contraindications: 'Avoid in sick or stressed animals'
        },
        {
            id: 'fenbendazole',
            name: 'Fenbendazole',
            type: 'Anti-parasitic',
            category: 'Broad Spectrum Anthelmintic',
            treatments: ['Roundworms', 'Tapeworms', 'Some lungworms'],
            dosage: {
                amount: 5,
                unit: 'mg/kg',
                route: 'Oral suspension',
                frequency: 'Once daily for 3 days',
                calculation: (weightKg) => `${(weightKg * 5).toFixed(1)}mg (${(weightKg * 5 / 100).toFixed(2)}ml of 10% suspension) per day`
            },
            withdrawalPeriod: {
                meat: 14,
                milk: 5
            },
            sideEffects: 'Generally well tolerated',
            precautions: 'Safe for pregnant animals. Give with feed.',
            contraindications: 'None known'
        },
        {
            id: 'ceftriaxone',
            name: 'Ceftriaxone',
            type: 'Antibiotic',
            category: 'Third Generation Cephalosporin',
            treatments: ['Severe bacterial infections', 'Septicemia', 'Pneumonia'],
            dosage: {
                amount: 15,
                unit: 'mg/kg',
                route: 'Intramuscular (IM) or Intravenous (IV)',
                frequency: 'Once or twice daily for 3-5 days',
                calculation: (weightKg) => `${(weightKg * 15).toFixed(0)}mg per dose`
            },
            withdrawalPeriod: {
                meat: 21,
                milk: 4
            },
            sideEffects: 'Rare allergic reactions',
            precautions: 'Reserve for serious infections. Reconstitute just before use.',
            contraindications: 'Avoid in animals with cephalosporin allergy'
        }
    ],

    // POULTRY MEDICINES
    poultry: [
        {
            id: 'amoxicillin-poultry',
            name: 'Amoxicillin (Water Soluble)',
            type: 'Antibiotic',
            category: 'Penicillin-based',
            treatments: ['Respiratory infections', 'E. coli infections', 'Salmonellosis'],
            dosage: {
                amount: 15,
                unit: 'mg/kg body weight',
                route: 'Drinking water',
                frequency: '5-7 days continuously',
                calculation: (weightKg) => `For 100 birds: 50-100g powder per 100L drinking water`
            },
            withdrawalPeriod: {
                meat: 7,
                eggs: 3
            },
            sideEffects: 'Generally safe, rare gut disturbance',
            precautions: 'Prepare fresh solution daily. Discard unused after 24 hours.',
            contraindications: 'Not for layers producing eggs for human consumption during treatment'
        },
        {
            id: 'enrofloxacin-poultry',
            name: 'Enrofloxacin (Water Soluble)',
            type: 'Antibiotic',
            category: 'Fluoroquinolone',
            treatments: ['Colibacillosis', 'Chronic respiratory disease', 'Salmonellosis'],
            dosage: {
                amount: 10,
                unit: 'mg/kg body weight',
                route: 'Drinking water',
                frequency: '3-5 days',
                calculation: (weightKg) => `For 100 birds: 50ml of 10% solution per 100L water`
            },
            withdrawalPeriod: {
                meat: 14,
                eggs: 7
            },
            sideEffects: 'Rare CNS effects at overdose',
            precautions: 'Complete full course. Avoid prolonged use.',
            contraindications: 'Not for use in growing birds under 2 weeks'
        },
        {
            id: 'coccidiostat',
            name: 'Amprolium (Coccidiostat)',
            type: 'Anti-protozoal',
            category: 'Coccidiosis Treatment',
            treatments: ['Coccidiosis', 'Bloody diarrhea'],
            dosage: {
                amount: 100,
                unit: 'mg/L drinking water',
                route: 'Drinking water',
                frequency: '5-7 days',
                calculation: (weightKg) => '100-200mg per liter of drinking water for treatment'
            },
            withdrawalPeriod: {
                meat: 0,
                eggs: 0
            },
            sideEffects: 'Thiamine deficiency at prolonged high doses',
            precautions: 'Do not use with sulfonamides. Ensure good ventilation.',
            contraindications: 'None significant'
        },
        {
            id: 'vitamin-b-complex',
            name: 'Vitamin B-Complex',
            type: 'Vitamin Supplement',
            category: 'Nutritional Support',
            treatments: ['Stress', 'Poor growth', 'Post-antibiotic recovery', 'Feather pecking'],
            dosage: {
                amount: 1,
                unit: 'ml per liter',
                route: 'Drinking water',
                frequency: '3-5 days monthly',
                calculation: (weightKg) => '1-2ml per liter of drinking water'
            },
            withdrawalPeriod: {
                meat: 0,
                eggs: 0
            },
            sideEffects: 'None',
            precautions: 'Water-soluble, excess excreted. Use fresh daily.',
            contraindications: 'None'
        },
        {
            id: 'sulfadimidine',
            name: 'Sulfadimidine',
            type: 'Antibiotic',
            category: 'Sulfonamide',
            treatments: ['Coccidiosis', 'Fowl cholera', 'Pullorum disease'],
            dosage: {
                amount: 200,
                unit: 'mg/L drinking water',
                route: 'Drinking water',
                frequency: '5 days',
                calculation: (weightKg) => '200mg per liter of drinking water'
            },
            withdrawalPeriod: {
                meat: 10,
                eggs: 7
            },
            sideEffects: 'May cause reduced egg production temporarily',
            precautions: 'Ensure adequate water intake. Monitor for dehydration.',
            contraindications: 'Not with amprolium or other sulfa drugs'
        },
        {
            id: 'tylosin',
            name: 'Tylosin (Water Soluble)',
            type: 'Antibiotic',
            category: 'Macrolide',
            treatments: ['Chronic respiratory disease', 'Necrotic enteritis', 'Mycoplasma'],
            dosage: {
                amount: 0.5,
                unit: 'g/L drinking water',
                route: 'Drinking water',
                frequency: '3-5 days',
                calculation: (weightKg) => '0.5g per liter of drinking water'
            },
            withdrawalPeriod: {
                meat: 14,
                eggs: 3
            },
            sideEffects: 'Rare diarrhea',
            precautions: 'Complete full course. Fresh solution daily.',
            contraindications: 'None significant'
        }
    ]
};

// Shared medicines that apply to multiple species (reference above)
medicineDatabase.buffalo = medicineDatabase.cattle;
medicineDatabase.sheep = medicineDatabase.goat;

/**
 * Get all medicines for a specific species
 */
function getMedicinesBySpecies(species) {
    const normalizedSpecies = species.toLowerCase();
    return medicineDatabase[normalizedSpecies] || [];
}

/**
 * Get medicine details by species and medicine ID
 */
function getMedicineById(species, medicineId) {
    const medicines = getMedicinesBySpecies(species);
    return medicines.find(med => med.id === medicineId);
}

/**
 * Search medicines by treatment type
 */
function searchByTreatment(species, treatmentQuery) {
    const medicines = getMedicinesBySpecies(species);
    const query = treatmentQuery.toLowerCase();

    return medicines.filter(med =>
        med.treatments.some(treatment =>
            treatment.toLowerCase().includes(query)
        )
    );
}

/**
 * Get all medicine types/categories
 */
function getMedicineCategories(species) {
    const medicines = getMedicinesBySpecies(species);
    const categories = new Set();

    medicines.forEach(med => {
        categories.add(med.type);
    });

    return Array.from(categories);
}

/**
 * Calculate exact dosage for given animal weight
 */
function calculateDosage(species, medicineId, weightKg) {
    const medicine = getMedicineById(species, medicineId);

    if (!medicine || !medicine.dosage.calculation) {
        return null;
    }

    return {
        medicineName: medicine.name,
        animalWeight: weightKg,
        dosage: medicine.dosage.calculation(weightKg),
        route: medicine.dosage.route,
        frequency: medicine.dosage.frequency,
        withdrawalPeriod: medicine.withdrawalPeriod,
        precautions: medicine.precautions
    };
}

module.exports = {
    medicineDatabase,
    getMedicinesBySpecies,
    getMedicineById,
    searchByTreatment,
    getMedicineCategories,
    calculateDosage
};
