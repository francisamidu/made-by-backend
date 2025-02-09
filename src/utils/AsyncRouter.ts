// src/utils/asyncRouter.ts

import express, { Router, RequestHandler, RouterOptions } from 'express';
import catchAsync from './catchAsync';

/**
 * AsyncRouter Class
 * Extends Express Router functionality to automatically handle async route handlers
 * Wraps all route handlers with catchAsync to provide consistent error handling
 */
class AsyncRouter {
  /**
   * The underlying Express Router instance
   */
  public router: Router;

  /**
   * Creates a new AsyncRouter instance
   * @param options - Standard Express RouterOptions configuration
   */
  constructor(options?: RouterOptions) {
    this.router = express.Router(options);
  }

  /**
   * Handles GET requests with automatic error handling
   * @param path - The route path
   * @param handlers - Array of middleware and route handler functions
   * @returns The Express Router instance for method chaining
   */
  public get(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.get(path, ...wrappedHandlers);
    return this.router;
  }

  /**
   * Handles POST requests with automatic error handling
   * @param path - The route path
   * @param handlers - Array of middleware and route handler functions
   * @returns The Express Router instance for method chaining
   */
  public post(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.post(path, ...wrappedHandlers);
    return this.router;
  }

  /**
   * Handles PUT requests with automatic error handling
   * @param path - The route path
   * @param handlers - Array of middleware and route handler functions
   * @returns The Express Router instance for method chaining
   */
  public put(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.put(path, ...wrappedHandlers);
    return this.router;
  }

  /**
   * Handles DELETE requests with automatic error handling
   * @param path - The route path
   * @param handlers - Array of middleware and route handler functions
   * @returns The Express Router instance for method chaining
   */
  public delete(path: string, ...handlers: RequestHandler[]): Router {
    const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
    this.router.delete(path, ...wrappedHandlers);
    return this.router;
  }

  // Add other HTTP methods as needed (e.g., patch, options, etc.)
}

export default AsyncRouter;
