import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  try {
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS roll_number TEXT`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth DATE`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS gender TEXT`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_name TEXT`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS contact_number TEXT`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT`);

    await pool.query(`ALTER TABLE admissions ADD COLUMN IF NOT EXISTS previous_school TEXT`);
    await pool.query(`ALTER TABLE admissions ADD COLUMN IF NOT EXISTS parent_email TEXT`);
    await pool.query(`ALTER TABLE admissions ADD COLUMN IF NOT EXISTS parent_phone TEXT`);
    
    console.log('ALTER TABLE SUCCESSFUL');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}
run();
