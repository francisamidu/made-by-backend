import {
  serial,
  text,
  varchar,
  timestamp,
  integer,
  index,
  uniqueIndex,
  pgTable,
} from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable(
  'users',
  {
    userId: serial('user_id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    role: varchar('role', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [
    uniqueIndex('username_idx').on(t.username),
    uniqueIndex('email_idx').on(t.email),
  ],
);

// Categories Table
export const categories = pgTable(
  'categories',
  {
    categoryId: serial('category_id').primaryKey(),
    categoryName: varchar('category_name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [uniqueIndex('category_name_idx').on(t.categoryName)],
);

// Terminologies Table
export const terminologies = pgTable(
  'terminologies',
  {
    termId: serial('term_id').primaryKey(),
    term: varchar('term', { length: 255 }).notNull(),
    definition: text('definition').notNull(),
    referenceUrl: varchar('reference_url', { length: 255 }), // Optional reference URL
    categoryId: integer('category_id').references(() => categories.categoryId),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [uniqueIndex('term_idx').on(t.term)],
);

// Educational Insights Table
export const educationalInsights = pgTable(
  'educational_insights',
  {
    insightId: serial('insight_id').primaryKey(),
    termId: integer('term_id').references(() => terminologies.termId),
    content: text('content').notNull(),
    source: varchar('source', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [index('term_id_idx').on(t.termId)],
);

// User_Terminologies Table
export const userTerminologies = pgTable('user_terminologies', {
  userTermId: serial('user_term_id').primaryKey(),
  userId: integer('user_id').references(() => users.userId),
  termId: integer('term_id').references(() => terminologies.termId),
  createdAt: timestamp('created_at').defaultNow(),
});

// Search Logs Table
export const searchLogs = pgTable(
  'search_logs',
  {
    logId: serial('log_id').primaryKey(),
    userId: integer('user_id').references(() => users.userId),
    searchQuery: varchar('search_query', { length: 255 }).notNull(),
    searchTime: timestamp('search_time').defaultNow(),
  },
  (t) => [index('search_query_idx').on(t.searchQuery)],
);
