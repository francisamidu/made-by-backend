import { AuthTokens, OAuthCallbackProfile } from './auth';
import { TCreator } from './schema';

/**
 * Unified Response Type
 */
export interface ApiResponse<T = any> {
  data: T | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
    [key: string]: any;
  };
  error?: string;
  success?: boolean;
}

export interface OAuthCallbackResponse {
  creator: Partial<TCreator>;
  tokens: AuthTokens;
}
