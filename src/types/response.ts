/**
 * Unified Response Type
 */
export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
    [key: string]: any;
  };
  error?: {
    message: string;
    code?: string;
    [key: string]: any;
  };
}
