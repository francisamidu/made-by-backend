declare module 'swagger-jsdoc';
declare module 'swagger-ui-express';

declare global {
  namespace Express {
    interface Request {
      user?: TCreator;
    }
  }
}
