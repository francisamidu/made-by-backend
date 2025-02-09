import {
  users,
  categories,
  terminologies,
  educationalInsights,
  searchLogs,
  userRoles,
  terminologyStatus,
  NewUser,
} from './schema'; // Import your schema definitions
import { db } from '.';
import logger from '@/logger';

/**
 * Seeds the users table with initial user accounts
 * Creates admin, editor, and viewer accounts with predefined roles
 * @returns Array of inserted user records
 */
async function seedUsers() {
  const userData = [
    {
      username: 'admin',
      passwordHash: 'hashedpassword1',
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

  const insertedUsers = await db.insert(users).values(userData).returning();
  return insertedUsers;
}

/**
 * Seeds the categories table with initial medical categories
 * Creates base categories for organizing medical terms
 * @returns Array of inserted category records
 */
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

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();
  return insertedCategories;
}

/**
 * Seeds the terminologies table with initial medical terms
 * @param categoryMap - Mapping of category names to their IDs
 * @returns Array of inserted terminology records
 */
async function seedTerminologies(categoryMap: { [k: string]: number }) {
  const terminologyData = [
    {
      term: 'Aorta',
      definition:
        'The main artery that carries blood away from your heart to the rest of your body.',
      referenceUrl: 'http://example.com/aorta',
      categoryId: categoryMap['Anatomy'],
      status: terminologyStatus.enumValues[2],
    },
    {
      term: 'Antibiotic',
      definition:
        'A type of medicine that inhibits the growth of or destroys microorganisms.',
      referenceUrl: 'http://example.com/antibiotic',
      categoryId: categoryMap['Pharmacology'],
      status: terminologyStatus.enumValues[1],
    },
  ];

  const insertedTerms = await db
    .insert(terminologies)
    .values(terminologyData)
    .returning();
  return insertedTerms;
}

/**
 * Seeds the educational insights table with initial content
 * @param termMap - Mapping of terminology terms to their IDs
 */
async function seedEducationalInsights(termMap: { [k: string]: number }) {
  const insightData = [
    {
      termId: termMap['Aorta'],
      content: 'The aorta is divided into four sections...',
      contentType: 'text',
      source: 'Medical Textbook',
      isApproved: true,
    },
    {
      termId: termMap['Antibiotic'],
      content:
        'Antibiotics are among the most frequently prescribed medications...',
      contentType: 'text',
      source: 'Pharmaceutical Journal',
      isApproved: true,
    },
  ];

  await db.insert(educationalInsights).values(insightData);
}

/**
 * Seeds the search logs table with sample search data
 * @param userMap - Mapping of usernames to their IDs
 */
async function seedSearchLogs(userMap: { [k: string]: number }) {
  const logData = [
    {
      userId: userMap['admin'],
      searchQuery: 'Aorta',
      ipAddress: '192.168.1.1',
      deviceInfo: 'Desktop Chrome',
    },
    {
      userId: userMap['editor'],
      searchQuery: 'Antibiotic',
      ipAddress: '192.168.1.2',
      deviceInfo: 'Mobile Safari',
    },
  ];

  await db.insert(searchLogs).values(logData);
}

/**
 * Main seeding function that orchestrates the entire seeding process
 * Executes seeding functions in the correct order to maintain referential integrity
 * Handles the creation of all necessary mappings between related records
 */
async function seedDatabase() {
  const insertedUsers = await seedUsers();
  const userMap = Object.fromEntries(
    insertedUsers.map((user) => [user.username, user.userId]),
  );

  const insertedCategories = await seedCategories();
  const categoryMap = Object.fromEntries(
    insertedCategories.map((category) => [
      category.categoryName,
      category.categoryId,
    ]),
  );
  logger.info(insertedUsers);

  const insertedTerms = await seedTerminologies(categoryMap);
  const termMap = Object.fromEntries(
    insertedTerms.map((term) => [term.term, term.termId]),
  );

  await seedEducationalInsights(termMap);
  await seedSearchLogs(userMap);

  console.log('Database seeded successfully!');
}

// Execute the seeding process
seedDatabase().catch(console.error);
