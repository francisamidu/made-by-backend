import { QueryDictionary } from './request';
import {
  TProjectSort,
  TCreatorSort,
  TCreator,
  TPaginatedResponse,
  TProjectResponse,
} from './schema';

/**
 * Base Query Parameters
 */
export interface BaseQueryParams extends QueryDictionary {
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}

/**
 * Common Path Parameters
 */
export interface IdParam extends QueryDictionary {
  id?: string;
}

/**
 * Auth Query Types
 */
export interface AuthQuery {
  provider?: 'github' | 'google' | 'twitter' | 'linkedin';
  redirect?: string;
}

/**
 * Creator Query Types
 */
export interface CreatorQueryParams extends BaseQueryParams {
  username?: string;
  location?: string;
  isAvailable?: string;
  sort?: TCreatorSort;
  skills?: string;
  tools?: string;
}

export interface CreatorPathParams extends IdParam {
  username?: string;
  location?: string;
}

/**
 * Project Query Types
 */
export interface ProjectQueryParams extends BaseQueryParams {
  creatorId?: string;
  tags?: string;
  sort?: TProjectSort;
  featured?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectPathParams extends IdParam {
  creatorId?: string;
  tags?: string;
}

/**
 * Comment Query Types
 */
export interface CommentQueryParams extends BaseQueryParams {
  projectId?: string;
  creatorId?: string;
  sort?: 'latest' | 'oldest';
}

export interface CommentPathParams extends IdParam {
  projectId?: string;
  creatorId?: string;
}

/**
 * Follow Query Types
 */
export interface FollowQueryParams extends BaseQueryParams {
  followerId?: string;
  followingId?: string;
}

export interface FollowPathParams extends IdParam {
  followerId?: string;
  followingId?: string;
}

/**
 * Analytics Query Types
 */
export interface AnalyticsQueryParams extends BaseQueryParams {
  startDate?: string;
  endDate?: string;
  type?: 'views' | 'likes' | 'follows' | 'engagement';
  interval?: 'day' | 'week' | 'month';
}

export interface AnalyticsPathParams extends IdParam {
  metric?: string;
}

/**
 * Search Query Types
 */
export interface SearchQueryParams extends BaseQueryParams {
  query?: string;
  type?: 'creator' | 'project' | 'all';
  tags?: string;
  location?: string;
  isAvailable?: string;
  sort?: 'relevance' | 'latest' | 'popular';
}

/**
 * Media Query Types
 */
export interface MediaQueryParams {
  width?: string;
  height?: string;
  quality?: string;
  format?: 'jpg' | 'png' | 'webp';
  url?: string;
}

export interface MediaPathParams extends IdParam {
  type?: 'avatar' | 'banner' | 'project';
}

export interface ToggleLikeBody {
  increment?: boolean;
}

export interface SuccessResponse {
  success: boolean;
}

export interface LikeResponse {
  likes: number;
}

// Response types
export interface GlobalSearchReults {
  creators: TPaginatedResponse<TCreator | Partial<TCreator>>;
  projects: TPaginatedResponse<TProjectResponse>;
}

export interface SearchMetadata {
  query: string;
  page: number;
  limit: number;
  timestamp: string;
  total?: number;
  hasMore?: boolean;
}

export interface SuggestionsResponse {
  suggestions: string[];
  query: string;
  count: number;
}
/**
 * Unified Query Types
 */
export type QueryParams =
  | BaseQueryParams
  | CreatorQueryParams
  | ProjectQueryParams
  | CommentQueryParams
  | FollowQueryParams
  | AnalyticsQueryParams
  | SearchQueryParams
  | MediaQueryParams;

export type PathParams =
  | IdParam
  | CreatorPathParams
  | ProjectPathParams
  | CommentPathParams
  | FollowPathParams
  | AnalyticsPathParams
  | MediaPathParams;
