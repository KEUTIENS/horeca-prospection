import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool;

export const initDatabase = async (): Promise<void> => {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'horeca_prospection',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test connection
  try {
    const client = await pool.connect();
    logger.info('PostgreSQL connection successful');
    client.release();
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }

  // Handle pool errors
  pool.on('error', (err: Error) => {
    logger.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase() first.');
  }
  return pool;
};

export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug({ text, duration, rows: res.rowCount }, 'Executed query');
    return res;
  } catch (error) {
    logger.error({ text, error }, 'Query error');
    throw error;
  }
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    logger.info('Database pool closed');
  }
};



