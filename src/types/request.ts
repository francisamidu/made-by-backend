import { TCreator } from './schema';

/**
 * Unified Request Type
 */
export interface ApiRequest<
  P = {}, // Params
  B = {}, // Body
  Q = {}, // Query
> extends Express.Request {
  params: P & {
    id?: string;
    [key: string]: any;
  };
  body: B & {
    [key: string]: any;
  };
  query: Q & {
    page?: string;
    limit?: string;
    [key: string]: any;
  };
  user?: TCreator; // From auth middleware
}
