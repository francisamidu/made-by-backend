import { creators, projects, comments, follows } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

// Main table schemas
export interface TableSchema {
  creators: InferSelectModel<typeof creators>;
  projects: InferSelectModel<typeof projects>;
  comments: InferSelectModel<typeof comments>;
  follows: InferSelectModel<typeof follows>;
}

// Creator Stats Interface
export interface TCreatorStats {
  projectViews: number;
  appreciations: number;
  followers: number;
  following: number;
}

// Social Links Interface
export interface TSocialLinks {
  linkedln?: string;
  github?: string;
  dribbble?: string;
  behance?: string;
  instagram?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

// Professional Info Interface
export interface TProfessionalInfo {
  title?: string;
  skills?: string[];
  tools?: string[];
  collaborators?: string[];
  portfolioLink?: string;
}

// 1. Creators Table
export interface TCreator {
  id: string; // UUID
  name: string;
  avatar: string;
  bio?: string;
  username?: string;
  location?: string;
  email?: string;
  bannerImage?: string;
  isAvailableForHire: boolean;
  stats: TCreatorStats;
  socialLinks: TSocialLinks;
  professionalInfo: TProfessionalInfo;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Projects Table
export interface TProject {
  id: string; // UUID
  title: string;
  description: string;
  creatorId: string; // UUID reference to creator
  images: string[];
  likes: number;
  views: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 3. Comments Table
export interface TComment {
  id: string; // UUID
  projectId: string; // UUID reference to project
  creatorId: string; // UUID reference to creator
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// 4. Follows Table
export interface TFollow {
  followerId: string; // UUID reference to creator
  followingId: string; // UUID reference to creator
  createdAt: Date;
}

// Response Types for API
export interface TProjectResponse extends TProject {
  creator: TCreator;
  comments?: TComment[];
}

export interface TCreatorResponse extends TCreator {
  projects?: TProject[];
  followers?: TCreator[];
  following?: TCreator[];
}

// Request Types for API
export interface TCreateProjectRequest {
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

export interface TUpdateCreatorRequest {
  bio?: string;
  location?: string;
  isAvailableForHire?: boolean;
  professionalInfo?: Partial<TProfessionalInfo>;
  socialLinks?: Partial<TSocialLinks>;
}

// Search Types
export interface TSearchParams {
  query?: string;
  tags?: string[];
  location?: string;
  isAvailableForHire?: boolean;
  page?: number;
  limit?: number;
}

// Analytics Types
export interface TProjectAnalytics {
  totalViews: number;
  totalLikes: number;
  commentCount: number;
  viewsOverTime: Array<{
    date: Date;
    views: number;
  }>;
}

export interface TCreatorAnalytics {
  totalProjectViews: number;
  totalAppreciations: number;
  followerGrowth: Array<{
    date: Date;
    followers: number;
  }>;
  projectEngagement: Array<{
    projectId: string;
    title: string;
    views: number;
    likes: number;
  }>;
}

// Utility Types
export type TProjectSort = 'latest' | 'popular' | 'trending';

export type TProjectSortType = `${TProjectSort}`;

export type TCreatorSort = 'followers' | 'projects' | 'joined';

export interface TPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
