import dotenv from 'dotenv';
import app from './src/app';
import logger from './src/logger';
import { register } from 'tsconfig-paths';

register({
  baseUrl: __dirname,
  paths: {
    '@/*': ['./src/*'],
  },
});

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Medisync backend running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
