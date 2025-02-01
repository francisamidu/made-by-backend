import dotenv from 'dotenv';
import app from './src/app';
import logger from './src/logger';

dotenv.config();

const PORT = process.env.PORT || 5000;
console.log(process.env.DATABASE_URL);

// const server = app.listen(PORT, () => {
//   logger.info(`🚀 Medisync backend running on http://localhost:${PORT}`);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   logger.error('Uncaught Exception:', err);
//   process.exit(1); // Mandatory (as per Node.js docs)
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   server.close(() => {
//     process.exit(1);
//   });
// });
