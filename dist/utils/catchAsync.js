// src/utils/catchAsync.ts
/**
 * A higher-order function to wrap async route handlers and forward errors.
 * @param fn - Async route handler function
 * @returns A new route handler function
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export default catchAsync;
