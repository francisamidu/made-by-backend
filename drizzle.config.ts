import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import env from './src/env';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: env.NODE_ENV === 'development' ? false : true,
  },
  schema: './src/db/schema.ts',
});
