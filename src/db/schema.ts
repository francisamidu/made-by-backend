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
} from 'drizzle-orm/pg-core';
export const baseSchema = pgSchema('medisync');

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

// ---------------------------
// 1. Users Table
// ---------------------------
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

// ---------------------------
// 2. Categories Table
// ---------------------------
export const categories = baseSchema.table(
  'categories',
  {
    categoryId: serial('category_id').primaryKey(),
    categoryName: varchar('category_name', { length: 100 }).notNull(),
    description: text('description'),
    iconUrl: varchar('icon_url', { length: 255 }),
    parentCategoryId: integer('parent_category_id').references(
      () => categories.categoryId,
      { onDelete: 'set null', onUpdate: 'cascade' },
    ),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('category_name_idx').on(table.categoryName),
    index('parent_category_idx').on(table.parentCategoryId),
  ],
);

// ---------------------------
// 3. Terminologies Table
// ---------------------------
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

// ---------------------------
// 4. Terminology Versions Table
// (Optional: For Versioning)
// ---------------------------
export const terminologyVersions = baseSchema.table(
  'terminology_versions',
  {
    versionId: serial('version_id').primaryKey(),
    termId: integer('term_id')
      .references(() => terminologies.termId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    term: varchar('term', { length: 255 }).notNull(),
    definition: text('definition').notNull(),
    referenceUrl: varchar('reference_url', { length: 255 }),
    status: terminologyStatus('status').default('Draft').notNull(),
    versionNumber: integer('version_number').notNull(),
    changedBy: integer('changed_by').references(() => users.userId, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('term_version_unique').on(table.termId, table.versionNumber),
    index('term_id_idx').on(table.termId),
  ],
);

// ---------------------------
// 5. Educational Insights Table
// ---------------------------
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

// ---------------------------
// 6. User_Favorites Table
// ---------------------------
export const userFavorites = baseSchema.table(
  'user_favorites',
  {
    favoriteId: serial('favorite_id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.userId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    termId: integer('term_id')
      .references(() => terminologies.termId, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    note: text('note'),
    rating: integer('rating'), // e.g., 1-5 scale
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_term_unique').on(table.userId, table.termId),
    index('user_id_idx').on(table.userId),
    index('term_id_idx').on(table.termId),
  ],
);

// ---------------------------
// 7. Search Logs Table
// ---------------------------
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
    ipAddress: inet('ip_address'), // IPv4/IPv6 address
    deviceInfo: varchar('device_info', { length: 255 }), // e.g., 'Chrome on Windows'
  },
  (table) => [
    uniqueIndex('log_unique').on(table.logId),
    index('search_query_idx').on(table.searchQuery),
    index('search_time_idx').on(table.searchTime),
  ],
);
