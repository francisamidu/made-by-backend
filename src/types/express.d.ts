import TCreator from './creator';
import { IRouter } from 'express';
declare global {
  namespace Express {
    interface Request {
      user?: TCreator;
    }
  }
}

/**
 * Extended Router interface with proper typing
 */
export interface IApiRouter extends IRouter {
  /**
   * GET method with type-safe handlers
   */
  get<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    path: string,
    ...handlers: ApiRequestHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter;

  /**
   * POST method with type-safe handlers
   */
  post<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    path: string,
    ...handlers: ApiRequestHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter;

  /**
   * PUT method with type-safe handlers
   */
  put<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    path: string,
    ...handlers: ApiRequestHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter;

  /**
   * DELETE method with type-safe handlers
   */
  delete<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    path: string,
    ...handlers: ApiRequestHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter;

  /**
   * PATCH method with type-safe handlers
   */
  patch<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    path: string,
    ...handlers: ApiRequestHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter;

  /**
   * USE middleware with type-safe handlers
   */
  use<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    path: string,
    ...handlers: ApiRequestHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter;
  use<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    ...handlers: ApiRequestHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter;
}
