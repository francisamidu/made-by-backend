// src/utils/asyncRouter.ts

import express, { Router, RequestHandler, RouterOptions } from 'express';
import catchAsync from './catchAsync';

/**
 * Extends Express Router to automatically wrap route handlers with catchAsync.
 */
class AsyncRouter {
  public router: Router;

  constructor(options?: RouterOptions) {
    this.router = express.Router(options);
  }

  // Override HTTP methods to wrap handlers automatically
  public get(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.get(path, ...wrappedHandlers);
    return this.router;
  }

  public post(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.post(path, ...wrappedHandlers);
    return this.router;
  }

  public put(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.put(path, ...wrappedHandlers);
    return this.router;
  }

  public delete(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.delete(path, ...wrappedHandlers);
    return this.router;
  }

  // Add other HTTP methods as needed (e.g., patch, options, etc.)
}

export default AsyncRouter;
