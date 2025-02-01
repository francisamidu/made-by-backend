import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import loggerMiddleware from './middlewares/loggerMiddleware';
import router from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Routes
app.use('/api', router);

// Health Check

// Error Handling Middleware
app.use(loggerMiddleware);
app.use(errorHandler);

export default app;
