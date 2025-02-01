import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import loggerMiddleware from './middlewares/loggerMiddleware';
import router from './routes';
import { errorHandler } from '@/middlewares/errorHandler';

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

export default app;
