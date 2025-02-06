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
// global config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routes = listEndpoints(router);
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
// Routes
app.use('/api', router);
// Error Handling Middleware
app.use(loggerMiddleware);
app.use('/routes', (_, response) => {
    response.json(routes);
});
// Swagger setup
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
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Handle 404 - Not Found
app.use((_req, res, _next) => {
    res.status(404).json({
        success: false,
        status: 404,
        message: 'Route Not Found',
    });
});
// Global Error Handler (should be the last middleware)
app.use(errorHandler);
const server = app.listen(env.APP_PORT, () => {
    logger.info(`🚀 Medisync backend running on http://localhost:${env.APP_PORT}`);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
        process.exit(1);
    });
});
