// Import required dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import loggerMiddleware from './middlewares/loggerMiddleware';
import router from './routes';
import { errorHandler } from '@/middlewares/errorHandler';
import logger from './logger';
import env from '@/env';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import listEndpoints from 'express-list-endpoints';

/**
 * Global Configuration
 * Set up __dirname equivalent for ES modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routes = listEndpoints(router);

// Initialize Express application
const app = express();

/**
 * Middleware Configuration
 * - express.json(): Parse JSON payloads
 * - express.urlencoded(): Parse URL-encoded bodies
 * - cors(): Enable Cross-Origin Resource Sharing
 * - helmet(): Add security headers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Mount main API routes
app.use('/api', router);

// Apply logging middleware
app.use(loggerMiddleware);

/**
 * Debug endpoint to list all available routes
 */
app.use('/routes', (_, response) => {
  response.json(routes);
});

/**
 * Swagger Documentation Configuration
 * Sets up API documentation using OpenAPI 3.0.0 specification
 */
const swaggerOptions = {
  swaggerDefinition: {
    myapi: '3.0.0',
    info: {
      title: 'Medisync API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: `http://localhost${env.APP_PORT}`,
      },
    ],
  },
  apis: [path.join(process.cwd(), './routes/*.ts')],
};

// Initialize and mount Swagger documentation
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * 404 Handler
 * Catches all unmatched routes and returns a standardized error response
 */
app.use((_req, res, _next) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Route Not Found',
  });
});

// Global error handler middleware
app.use(errorHandler);

/**
 * Start the server and listen on configured port
 */
const server = app.listen(env.APP_PORT, () => {
  logger.info(
    `🚀 Medisync backend running on http://localhost:${env.APP_PORT}`,
  );
});

/**
 * Error Handling for Uncaught Exceptions
 * Logs the error and exits the process
 */
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

/**
 * Error Handling for Unhandled Promise Rejections
 * Logs the error, gracefully closes the server, and exits the process
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});
