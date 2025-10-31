const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Case = require('./models/Case');

// Path to your JSON file
const casesFilePath = path.join('D:', 'Projects', 'LawKnot', 'server', 'data', 'cases.json');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/lawknot');
    console.log('✅ Connected to MongoDB');

    // Read the JSON file
    const data = fs.readFileSync(casesFilePath, 'utf-8');
    const cases = JSON.parse(data);

    if (!Array.isArray(cases) || cases.length === 0) {
      console.error('❌ No valid case data found in JSON file.');
      process.exit(1);
    }

    // Clear existing cases
    await Case.deleteMany({});
    console.log('🗑️ Cleared existing cases');

    // Insert new cases from JSON
    await Case.insertMany(cases);
    console.log(`✅ Inserted ${cases.length} cases successfully`);

    // Close the connection
    await mongoose.connection.close();
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
