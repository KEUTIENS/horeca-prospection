import { readFileSync } from 'fs';
import { join } from 'path';
import { query, initDatabase, closeDatabase } from './connection';
import { logger } from '../utils/logger';

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');

    await initDatabase();

    // Read schema.sql
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Execute schema
    await query(schema);

    logger.info('✅ Database migrations completed successfully');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    await closeDatabase();
    process.exit(1);
  }
}

runMigrations();



