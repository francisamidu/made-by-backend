import {
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  inet,
  uniqueIndex,
  index,
  pgSchema,
  type PgTable,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

/**
 * Database Schema Definition
 * Defines the structure and relationships of all database tables
 */

// Create a custom schema namespace for the application
export const baseSchema = pgSchema('medisync');

/**
 * Enum Definitions
 * Define custom enumerated types for use across tables
 */
export const userRoles = baseSchema.enum('user_roles', [
  'Admin',
  'Editor',
  'Viewer',
]);

export const terminologyStatus = baseSchema.enum('terminology_status', [
  'Draft',
  'Reviewed',
  'Approved',
]);

/**
 * Users Table
 * Stores user account information and authentication details
 * Includes roles, email verification status, and timestamps
 */
export const users = baseSchema.table(
  'users',
  {
    userId: serial('user_id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    role: userRoles('role').notNull(),
    isEmailVerified: boolean('is_email_verified').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('username_idx').on(table.username),
    uniqueIndex('email_idx').on(table.email),
    index('is_active_idx').on(table.isActive),
  ],
);

/**
 * Categories Table
 * Manages hierarchical organization of medical terminologies
 * Supports parent-child relationships between categories
 */
export const categories = baseSchema.table(
  'categories',
  {
    categoryId: serial('category_id').primaryKey(),
    categoryName: varchar('category_name', { length: 100 }).notNull(),
    description: text('description'),
    iconUrl: varchar('icon_url', { length: 255 }),
    parentCategoryId: integer('parent_category_id').references(
      (): AnyPgColumn => categories.categoryId,
      {
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
    ),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('category_name_idx').on(table.categoryName),
    index('parent_category_idx').on(table.parentCategoryId),
  ],
);

/**
 * Terminologies Table
 * Stores medical terms, their definitions, and metadata
 * Links to categories and tracks approval status
 */
export const terminologies = baseSchema.table(
  'terminologies',
  {
    termId: serial('term_id').primaryKey(),
    term: varchar('term', { length: 255 }).notNull(),
    definition: text('definition').notNull(),
    referenceUrl: varchar('reference_url', { length: 255 }),
    categoryId: integer('category_id')
      .references(() => categories.categoryId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    status: terminologyStatus('status').default('Draft').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('term_idx').on(table.term),
    index('category_id_idx').on(table.categoryId),
    // Full-Text Search Index can be added at the database level
  ],
);

/**
 * Educational Insights Table
 * Contains supplementary educational content for medical terms
 * Supports multiple content types (text, video, image)
 */
export const educationalInsights = baseSchema.table(
  'educational_insights',
  {
    insightId: serial('insight_id').primaryKey(),
    termId: integer('term_id')
      .references(() => terminologies.termId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    content: text('content').notNull(),
    contentType: varchar('content_type', { length: 50 })
      .default('text')
      .notNull(), // e.g., 'text', 'video', 'image'
    mediaUrl: varchar('media_url', { length: 255 }), // Applicable if contentType is not 'text'
    source: varchar('source', { length: 255 }),
    isApproved: boolean('is_approved').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('insight_unique').on(table.insightId),
    index('term_id_idx').on(table.termId),
    index('is_approved_idx').on(table.isApproved),
  ],
);

/**
 * Search Logs Table
 * Tracks user search activity and analytics
 * Records search queries, timing, and user context
 */
export const searchLogs = baseSchema.table(
  'search_logs',
  {
    logId: serial('log_id').primaryKey(),
    userId: integer('user_id').references(() => users.userId, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    searchQuery: varchar('search_query', { length: 255 }).notNull(),
    searchTime: timestamp('search_time').defaultNow().notNull(),
    ipAddress: inet('ip_address'),
    deviceInfo: varchar('device_info', { length: 255 }),
  },
  (table) => [
    uniqueIndex('log_unique').on(table.logId),
    index('search_query_idx').on(table.searchQuery),
    index('search_time_idx').on(table.searchTime),
  ],
);

/**
 * Type Definitions
 * Generate TypeScript types from table schemas for type safety
 */
export type SearchLog = InferSelectModel<typeof searchLogs>;
export type NewSearchLog = InferInsertModel<typeof searchLogs>;
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type EducationalInsight = InferSelectModel<typeof educationalInsights>;
export type NewEducationalInsight = InferInsertModel<
  typeof educationalInsights
>;
export type Terminology = InferSelectModel<typeof terminologies>;
export type NewTerminology = InferInsertModel<typeof terminologies>;
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;
