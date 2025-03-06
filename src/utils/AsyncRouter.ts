// src/utils/asyncRouter.ts
import express, {
  Router,
  RouterOptions,
  RequestHandler,
  NextFunction,
  Response,
} from 'express';
import { ApiHandler, ParamsDictionary, QueryDictionary } from '@/types/request';
import { IApiRouter } from '@/types/express';

/**
 * AsyncRouter Class
 * Provides type-safe routing with automatic error handling
 */
class AsyncRouter implements IApiRouter {
  private readonly router: Router;

  constructor(options?: RouterOptions) {
    this.router = express.Router(options);
  }

  /**
   * Converts our ApiHandler to Express RequestHandler while maintaining type safety
   */
  private wrapHandler<
    P extends ParamsDictionary,
    ResB,
    ReqB,
    ReqQ extends QueryDictionary,
  >(handler: ApiHandler<P, ResB, ReqB, ReqQ>): RequestHandler {
    return async (req, res, next) => {
      try {
        await handler(req, res as Response<ResB>, next);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * GET method implementation
   */
  public get<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(path: string, ...handlers: ApiHandler<P, ResB, ReqB, ReqQ>[]): IApiRouter {
    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler),
    );
    this.router.get(path, ...wrappedHandlers);
    return this as unknown as IApiRouter;
  }

  /**
   * POST method implementation
   */
  public post<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(path: string, ...handlers: ApiHandler<P, ResB, ReqB, ReqQ>[]): IApiRouter {
    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler),
    );
    this.router.post(path, ...wrappedHandlers);
    return this as unknown as IApiRouter;
  }

  /**
   * PUT method implementation
   */
  public put<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(path: string, ...handlers: ApiHandler<P, ResB, ReqB, ReqQ>[]): IApiRouter {
    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler),
    );
    this.router.put(path, ...wrappedHandlers);
    return this as unknown as IApiRouter;
  }

  /**
   * DELETE method implementation
   */
  public delete<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(path: string, ...handlers: ApiHandler<P, ResB, ReqB, ReqQ>[]): IApiRouter {
    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler),
    );
    this.router.delete(path, ...wrappedHandlers);
    return this as unknown as IApiRouter;
  }

  /**
   * PATCH method implementation
   */
  public patch<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(path: string, ...handlers: ApiHandler<P, ResB, ReqB, ReqQ>[]): IApiRouter {
    const wrappedHandlers = handlers.map((handler) =>
      this.wrapHandler(handler),
    );
    this.router.patch(path, ...wrappedHandlers);
    return this as unknown as IApiRouter;
  }

  /**
   * Middleware implementation
   */
  public use<
    P extends ParamsDictionary = ParamsDictionary,
    ResB = any,
    ReqB = any,
    ReqQ extends QueryDictionary = QueryDictionary,
  >(
    pathOrHandler: string | ApiHandler<P, ResB, ReqB, ReqQ>,
    ...handlers: ApiHandler<P, ResB, ReqB, ReqQ>[]
  ): IApiRouter {
    if (typeof pathOrHandler === 'string') {
      const wrappedHandlers = handlers.map((handler) =>
        this.wrapHandler(handler),
      );
      this.router.use(pathOrHandler, ...wrappedHandlers);
    } else {
      const wrappedHandlers = [pathOrHandler, ...handlers].map((handler) =>
        this.wrapHandler(handler),
      );
      this.router.use(...wrappedHandlers);
    }
    return this as unknown as IApiRouter;
  }

  /**
   * Route method implementation
  //  */
  // public route(path: string): IApiRouter {
  //   return this.router.route(path) as unknown as IApiRouter;
  // }

  /**
   * Get the underlying Express router
   */
  public getRouter(): Router {
    return this.router;
  }
}

export default AsyncRouter;
