import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * Database Connection Configuration
 * Creates and exports a drizzle ORM instance connected to PostgreSQL
 * Uses DATABASE_URL from environment variables for connection
 *
 * @note SSL is disabled for local development
 * @exports db - Configured Drizzle ORM instance
 */
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: false,
  },
});
