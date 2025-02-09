import {
  categories,
  educationalInsights,
  searchLogs,
  terminologies,
  users,
} from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export interface TableSchema {
  categories: InferSelectModel<typeof categories>;
  educationalInsights: InferSelectModel<typeof educationalInsights>;
  searchLogs: InferSelectModel<typeof searchLogs>;
  terminologies: InferSelectModel<typeof terminologies>;
  users: InferSelectModel<typeof users>;
}

// Enum for user roles
export enum TUserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

// Enum for terminology status
export enum TTerminologyStatus {
  Draft = 'draft',
  Reviewed = 'reviewed',
  Approved = 'approved',
}

// 1. Users Table
export interface TUser {
  userId: number;
  username: string;
  passwordHash: string;
  email: string;
  role: TUserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Categories Table
export interface TCategory {
  categoryId: number;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  parentCategoryId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Terminologies Table
export interface TTerminology {
  termId: number;
  term: string;
  definition: string;
  referenceUrl?: string | null;
  categoryId: number;
  status: TTerminologyStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 5. Educational Insights Table
export interface TEducationalInsight {
  insightId: number;
  termId: number;
  content: string;
  contentType: string; // e.g., 'text', 'video', 'image'
  mediaUrl?: string;
  source?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 6. User Favorites Table
export interface TUserFavorite {
  favoriteId: number;
  userId: number;
  termId: number;
  note?: string;
  rating?: number; // e.g., 1-5 scale
  createdAt: Date;
}

// 7. Search Logs Table
export interface TSearchLog {
  logId: number;
  userId?: number | null;
  searchQuery: string;
  searchTime: Date;
  ipAddress?: string;
  deviceInfo?: string;
}
