import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { Session } from 'express-session';
import { ParsedQs } from 'qs'; // Express uses this for query parsing
import { ApiResponse } from './response';
import { TCreator } from './schema';

/**
 * Params dictionary should match Express's ParamsDictionary
 * Express params are always strings
 */
export interface ParamsDictionary {
  [key: string]: string;
}

/**
 * Query dictionary should match Express's ParsedQs structure
 * Express uses the 'qs' library for query parsing
 */
export interface QueryDictionary extends ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

/**
 * Extended Request interface with proper typing
 * Maintains Express's type structure while adding our custom properties
 */
export interface ApiRequest<
  P = ParamsDictionary,
  ResB = any,
  ReqB = any,
  ReqQ = QueryDictionary,
> extends Request<P, ResB, ReqB, ReqQ> {
  session: Session & {
    returnTo?: string;
    state?: string;
    oauth?: {
      provider?: 'google' | 'github' | 'twitter';
      accessToken?: string;
      refreshToken?: string;
    };
  };
  user?: TCreator;
}

/**
 * Request handler with proper typing for Express compatibility
 */
export type ApiRequestHandler<
  P = ParamsDictionary,
  ResB = any,
  ReqB = any,
  ReqQ = QueryDictionary,
> = (
  req: ApiRequest<P, ReqB, ReqQ>,
  res: Response<ResB>,
  next: NextFunction,
) => Promise<void> | void;

/**
 * API handler with wrapped response type
 */
export type ApiHandler<
  P = ParamsDictionary,
  ResB = any,
  ReqB = any,
  ReqQ = QueryDictionary,
> = (
  req: ApiRequest<P, ReqB, ReqQ>,
  res: Response<ApiResponse<ResB>>,
  next: NextFunction,
) => Promise<void> | void;

/**
 * Type guard for checking if a request has a user
 */
export const isAuthenticated = (
  req: ApiRequest,
): req is ApiRequest & { user: TCreator } => {
  return req.user !== undefined;
};

/**
 * Helper type for route parameters
 */
export type RouteParams<T> = {
  [K in keyof T]: string;
};

/**
 * Helper type for query parameters
 */
export type QueryParams<T> = {
  [K in keyof T]: string | string[] | undefined;
};

// Usage examples:
export interface CreateProjectParams {
  creatorId: string;
}

export interface ProjectQueryParams {
  sort?: 'latest' | 'popular';
  tags?: string[];
  page?: string;
  limit?: string;
}

export interface RegistrationParams {
  email: string;
  password: string;
  fullname?: string;
}
