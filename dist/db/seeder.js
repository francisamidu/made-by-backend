import {
  users,
  categories,
  terminologies,
  educationalInsights,
  searchLogs,
  userRoles,
  terminologyStatus,
} from './schema.js'; // Import your schema definitions
import { db } from '.';
// Function to seed users
async function seedUsers() {
  const userData = [
    {
      username: 'admin',
      passwordHash: 'hashedpassword1', // In a real scenario, use bcrypt or similar to hash passwords
      email: 'admin@example.com',
      role: userRoles.enumValues[0],
      isEmailVerified: true,
      isActive: true,
    },
    {
      username: 'editor',
      passwordHash: 'hashedpassword2',
      email: 'editor@example.com',
      role: userRoles.enumValues[1],
      isEmailVerified: true,
      isActive: true,
    },
    {
      username: 'viewer',
      passwordHash: 'hashedpassword3',
      email: 'viewer@example.com',
      role: userRoles.enumValues[2],
      isEmailVerified: true,
      isActive: true,
    },
  ];
  for (const user of userData) {
    await db.insert(users).values(user).execute();
  }
}
// Function to seed categories
async function seedCategories() {
  const categoryData = [
    {
      categoryName: 'Anatomy',
      description: 'Terms related to human anatomy',
      iconUrl: 'http://example.com/icon1.png',
    },
    {
      categoryName: 'Pharmacology',
      description: 'Terms related to drugs and medications',
      iconUrl: 'http://example.com/icon2.png',
    },
  ];
  for (const category of categoryData) {
    await db.insert(categories).values(category).execute();
  }
}
// Function to seed terminologies
async function seedTerminologies() {
  const terminologyData = [
    {
      term: 'Aorta',
      definition:
        'The main artery that carries blood away from your heart to the rest of your body.',
      referenceUrl: 'http://example.com/aorta',
      categoryId: 1, // Assuming Anatomy has categoryId 1
      status: terminologyStatus.enumValues[2],
    },
    {
      term: 'Antibiotic',
      definition:
        'A type of medicine that inhibits the growth of or destroys microorganisms.',
      referenceUrl: 'http://example.com/antibiotic',
      categoryId: 2, // Assuming Pharmacology has categoryId 2
      status: terminologyStatus.enumValues[1],
    },
  ];
  for (const term of terminologyData) {
    await db.insert(terminologies).values(term).execute();
  }
}
// Function to seed educational insights
async function seedEducationalInsights() {
  const insightData = [
    {
      termId: 1, // Assuming Aorta has termId 1
      content: 'The aorta is divided into four sections...',
      contentType: 'text',
      source: 'Medical Textbook',
      isApproved: true,
    },
    {
      termId: 2, // Assuming Antibiotic has termId 2
      content:
        'Antibiotics are among the most frequently prescribed medications...',
      contentType: 'text',
      source: 'Pharmaceutical Journal',
      isApproved: true,
    },
  ];
  for (const insight of insightData) {
    await db.insert(educationalInsights).values(insight).execute();
  }
}
// Function to seed search logs
async function seedSearchLogs() {
  const logData = [
    {
      userId: 1, // Assuming admin has userId 1
      searchQuery: 'Aorta',
      ipAddress: '192.168.1.1',
      deviceInfo: 'Desktop Chrome',
    },
    {
      userId: 2, // Assuming editor has userId 2
      searchQuery: 'Antibiotic',
      ipAddress: '192.168.1.2',
      deviceInfo: 'Mobile Safari',
    },
  ];
  for (const log of logData) {
    await db.insert(searchLogs).values(log).execute();
  }
}
// Main function to run all seeders
async function seedDatabase() {
  await Promise.all([
    seedUsers(),
    seedCategories(),
    seedTerminologies(),
    seedEducationalInsights(),
    seedSearchLogs(),
  ]);
  console.log('Database seeded successfully!');
}
seedDatabase().catch(console.error);
