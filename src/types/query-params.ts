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
