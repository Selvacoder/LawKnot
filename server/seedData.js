const mongoose = require('mongoose');
const Case = require('./models/Case');

const sampleCases = [
  {
    title: "Smith v. Johnson Corp",
    citation: "123 F.3d 456 (9th Cir. 2023)",
    court: "9th Circuit Court of Appeals",
    date: new Date("2023-08-15"),
    jurisdiction: "Federal",
    caseType: "Contract Law",
    summary: "Court ruled on breach of contract claim involving software licensing agreement. Established precedent for implied warranties in digital products.",
    keyPoints: [
      "Implied warranties apply to software licenses",
      "Material breach requires substantial non-conformance",
      "Remedy includes both damages and specific performance"
    ],
    tags: ["software", "licensing", "breach", "warranties"],
    precedentValue: "High"
  },
  {
    title: "Technology Inc. v. Innovation LLC",
    citation: "456 S.Ct. 789 (2023)",
    court: "Supreme Court",
    date: new Date("2023-06-22"),
    jurisdiction: "Federal",
    caseType: "Intellectual Property",
    summary: "Patent infringement case involving AI technology. Court clarified standards for software patent eligibility under Section 101.",
    keyPoints: [
      "Abstract ideas require technological improvement",
      "AI algorithms can be patentable if sufficiently specific",
      "Prior art analysis must consider functional equivalence"
    ],
    tags: ["patent", "AI", "software", "section-101"],
    precedentValue: "High"
  },
  {
    title: "Workers Union v. Manufacturing Co",
    citation: "789 State Rep. 321 (Cal. 2023)",
    court: "California Supreme Court",
    date: new Date("2023-04-10"),
    jurisdiction: "California",
    caseType: "Employment Law",
    summary: "Class action regarding overtime compensation for remote workers. Established guidelines for tracking work hours in remote settings.",
    keyPoints: [
      "Employers must provide time-tracking systems for remote work",
      "Off-hours email responses can constitute compensable work time",
      "Clear policies required for after-hours availability expectations"
    ],
    tags: ["overtime", "remote-work", "class-action", "compensation"],
    precedentValue: "Medium"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/lawknot');
    console.log('Connected to MongoDB');

    // Clear existing cases
    await Case.deleteMany({});
    console.log('Cleared existing cases');

    // Insert sample cases
    await Case.insertMany(sampleCases);
    console.log('Sample cases inserted successfully');

    mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleCases };