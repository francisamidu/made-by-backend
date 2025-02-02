// src/utils/asyncRouter.ts
import express from 'express';
import catchAsync from './catchAsync';
/**
 * Extends Express Router to automatically wrap route handlers with catchAsync.
 */
class AsyncRouter {
    router;
    constructor(options) {
        this.router = express.Router(options);
    }
    // Override HTTP methods to wrap handlers automatically
    get(path, ...handlers) {
        const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
        this.router.get(path, ...wrappedHandlers);
        return this.router;
    }
    post(path, ...handlers) {
        const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
        this.router.post(path, ...wrappedHandlers);
        return this.router;
    }
    put(path, ...handlers) {
        const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
        this.router.put(path, ...wrappedHandlers);
        return this.router;
    }
    delete(path, ...handlers) {
        const wrappedHandlers = handlers.map((handler) => catchAsync(handler));
        this.router.delete(path, ...wrappedHandlers);
        return this.router;
    }
}
export default AsyncRouter;
