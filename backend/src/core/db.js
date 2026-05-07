import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { seedData } from './seed.js';

dotenv.config();

const { Pool } = pg;
let pool;
let mockMode = false;

export async function initDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    mockMode = true;
    console.warn('DATABASE_URL is not defined. Backend will run in mock mode with sample data.');
    return;
  }

  pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  pool.on('error', (error) => console.error('PostgreSQL pool error', error));

  if (process.env.INIT_DB_ON_STARTUP !== 'false') {
    await runMigrations();
    await seedData(query);
  }
}

export function isMock() {
  return mockMode;
}

export function getPool() {
  if (!pool) {
    throw new Error('Database pool has not been initialized. Set DATABASE_URL in .env.');
  }
  return pool;
}

export async function query(text, params = []) {
  const client = getPool();
  return client.query(text, params);
}

async function runMigrations() {
  try {
    const schemaPath = path.resolve(process.cwd(), 'src', 'core', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('Database schema ensured.');
  } catch (error) {
    console.error('Failed to run migrations:', error);
    throw error;
  }
}
