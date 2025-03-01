import { db } from '.';
import { creators, projects } from './schema';
import logger from '@/logger';

/**
 * Seeds the creators table with initial creator accounts
 * Creates sample creator profiles with various professional backgrounds
 */
async function seedCreators() {
  const creatorData = [
    {
      name: 'Ronas IT | UI',
      avatar: 'https://example.com/avatars/ronas.png',
      bio: "Award-winning UI/UX design agency specializing in healthcare digital solutions. With over 10 years of experience, we've helped transform patient care through intuitive design.",
      username: 'ronasit',
      location: 'Global',
      email: 'contact@ronasit.com',
      bannerImage: '@/assets/banner.jpg',
      isAvailableForHire: true,
      stats: {
        projectViews: 134000,
        appreciations: 145,
        followers: 5200,
        following: 320,
      },
      socialLinks: {
        linkedln: 'ronasit',
        github: 'ronasit',
        dribbble: 'ronasit',
      },
      professionalInfo: {
        title: 'UI/UX Design Agency',
        skills: [
          'UI Design',
          'UX Design',
          'Web Development',
          'Healthcare Solutions',
        ],
        tools: ['Figma', 'Adobe XD', 'Sketch'],
        collaborators: ['Healthcare Providers', 'Tech Companies'],
        portfolioLink: 'https://ronasit.com',
      },
    },
    {
      name: 'Kakha Kakhadzen',
      avatar: 'https://example.com/avatars/kakha.png',
      bio: 'Passionate logo designer with a minimalist approach. Creating distinctive brand identities for over 8 years.',
      username: 'kakhakakhadzen',
      location: 'Georgia',
      email: 'kakha@design.com',
      bannerImage: '@/assets/banner.jpg',
      isAvailableForHire: true,
      stats: {
        projectViews: 41000,
        appreciations: 48,
        followers: 2100,
        following: 150,
      },
      socialLinks: {
        linkedln: 'kakhakakhadzen',
        github: 'kakhakakhadzen',
      },
      professionalInfo: {
        title: 'Logo Designer & Brand Identity Expert',
        skills: ['Logo Design', 'Typography', 'Brand Identity', 'Vector Art'],
        tools: ['Adobe Illustrator', 'Adobe Photoshop'],
        collaborators: ['Startups', 'Design Studios'],
        portfolioLink: 'https://kakha.design',
      },
    },
  ];

  const insertedCreators = await db
    .insert(creators)
    .values(creatorData)
    .returning();
  return insertedCreators;
}

/**
 * Seeds the projects table with initial projects
 * @param creatorMap - Mapping of creator usernames to their IDs
 */
async function seedProjects(creatorMap: { [k: string]: string }) {
  const projectData = [
    {
      title: 'Healthcare Website Design',
      description:
        'A modern and accessible healthcare platform designed to improve patient experience. Features include appointment scheduling, telemedicine integration, and patient portal with clean UI/UX principles.',
      creatorId: creatorMap['ronasit'],
      images: [
        'https://example.com/projects/healthcare1.png',
        'https://example.com/projects/healthcare2.png',
      ],
      likes: 145,
      tags: ['healthcare', 'ui-design', 'web-development', 'accessibility'],
      views: 13400,
    },
    {
      title: 'Letter A Logo',
      description:
        'Minimalist logo design featuring a geometric interpretation of the letter A. Perfect for modern brands, with careful attention to balance, scalability, and versatility across different mediums.',
      creatorId: creatorMap['kakhakakhadzen'],
      images: [
        'https://example.com/projects/logo1.png',
        'https://example.com/projects/logo2.png',
      ],
      likes: 48,
      tags: ['logo-design', 'branding', 'minimalist', 'typography'],
      views: 4100,
    },
  ];

  const insertedProjects = await db
    .insert(projects)
    .values(projectData)
    .returning();
  return insertedProjects;
}

/**
 * Main seeding function that orchestrates the entire seeding process
 * Executes seeding functions in the correct order to maintain referential integrity
 */
async function seedDatabase() {
  try {
    // First seed creators
    const insertedCreators = await seedCreators();
    logger.info('Creators seeded successfully');

    // Create mapping of usernames to creator IDs
    const creatorMap = Object.fromEntries(
      insertedCreators.map((creator) => [creator.username, creator.id]),
    );

    // Then seed projects using creator IDs
    await seedProjects(creatorMap);
    logger.info('Projects seeded successfully');

    console.log('Database seeded successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}

// Execute the seeding process
seedDatabase().catch((error) => {
  logger.error('Failed to seed database:', error);
  process.exit(1);
});

// Add a cleanup function for testing environments
export async function cleanup() {
  try {
    await db.delete(projects);
    await db.delete(creators);
    logger.info('Database cleaned up successfully');
  } catch (error) {
    logger.error('Error cleaning up database:', error);
    throw error;
  }
}
