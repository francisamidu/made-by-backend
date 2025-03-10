import {
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  uniqueIndex,
  index,
  pgSchema,
} from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { v4 as uuidgene } from 'uuid';
console.log(uuidgene().slice(0, 5));
/**
 * Database Schema Definition
 * Defines the structure and relationships for the MadeBy creative platform
 */

// Create a custom schema namespace for the application
export const baseSchema = pgSchema('madeby');

/**
 * Creators Table
 * Stores professional creator profiles and their metadata
 * Includes personal info, stats, and professional details
 */
export const creators = baseSchema.table(
  'creators',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    avatar: text('avatar').notNull(),
    bio: text('bio'),
    password: text('password'),
    username: varchar('username', { length: 50 }).unique(),
    location: varchar('location', { length: 100 }),
    email: varchar('email', { length: 100 }).unique(),
    bannerImage: text('banner_image'),
    isAvailableForHire: boolean('is_available_for_hire').default(false),

    // Stats stored as JSONB for flexible querying
    stats: jsonb('stats')
      .default({
        projectViews: 0,
        appreciations: 0,
        followers: 0,
        following: 0,
      })
      .notNull(),

    // Social links stored as JSONB
    socialLinks: jsonb('social_links').default({}).notNull(),

    // Professional info stored as JSONB
    professionalInfo: jsonb('professional_info')
      .default({
        title: '',
        skills: [],
        tools: [],
        collaborators: [],
        portfolioLink: '',
      })
      .notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('username_idx').on(table.username),
    uniqueIndex('email_idx').on(table.email),
    index('location_idx').on(table.location),
    index('available_idx').on(table.isAvailableForHire),
  ],
);

/**
 * Projects Table
 * Stores creative projects and their associated metadata
 * Links to creators and includes engagement metrics
 */
export const projects = baseSchema.table(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    creatorId: uuid('creator_id')
      .references(() => creators.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),

    // Store image URLs as JSONB array
    images: jsonb('images').$type<string[]>().notNull(),

    likes: integer('likes').default(0).notNull(),
    views: integer('views').default(0).notNull(),

    // Store tags as JSONB array for better querying
    tags: jsonb('tags').$type<string[]>().default([]).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('created_by_idx').on(table.creatorId),
    index('likes_idx').on(table.likes),
    index('views_idx').on(table.views),
    index('created_on_idx').on(table.createdAt),
  ],
);

/**
 * Comments Table
 * Stores user comments on projects
 */
export const comments = baseSchema.table(
  'comments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .references(() => projects.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    creatorId: uuid('creator_id')
      .references(() => creators.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('project_idx').on(table.projectId),
    index('creator_idx').on(table.creatorId),
    index('created_idx').on(table.createdAt),
  ],
);

/**
 * Follows Table
 * Manages creator-to-creator following relationships
 */
export const follows = baseSchema.table(
  'follows',
  {
    followerId: uuid('follower_id')
      .references(() => creators.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    followingId: uuid('following_id')
      .references(() => creators.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('follower_following_idx').on(
      table.followerId,
      table.followingId,
    ),
    index('follower_idx').on(table.followerId),
    index('following_idx').on(table.followingId),
  ],
);

/**
 * Type Definitions
 * Generate TypeScript types from table schemas for type safety
 */
export type Creator = InferSelectModel<typeof creators>;
export type NewCreator = InferInsertModel<typeof creators>;
export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;
export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;
export type Follow = InferSelectModel<typeof follows>;
export type NewFollow = InferInsertModel<typeof follows>;

// Custom types for JSONB columns
export interface CreatorStats {
  projectViews: number;
  appreciations: number;
  followers: number;
  following: number;
}

export interface SocialLinks {
  linkedln?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

export interface ProfessionalInfo {
  title?: string;
  skills?: string[];
  tools?: string[];
  collaborators?: string[];
  portfolioLink?: string;
}
