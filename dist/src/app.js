import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import loggerMiddleware from './middlewares/loggerMiddleware';
import router from './routes';
import { errorHandler } from '@/middlewares/errorHandler';
import logger from './logger';
import env from '@/env';
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
    process.exit(1); // Mandatory (as per Node.js docs)
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=app.js.map