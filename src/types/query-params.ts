/**
 * Type definitions for request parameters
 */
export interface TimeQueryParams {
  startDate: string;
  endDate: string;
}

export interface PaginationQueryParams {
  page?: string;
  limit?: string;
}

/**
 * Type definitions for request parameters
 */
export interface FollowRequestBody {
  followerId: string;
  followingId: string;
}

export interface FollowParams {
  followerId: string;
  followingId: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
