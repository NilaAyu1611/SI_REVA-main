import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('Expanding sasaran_program with multi-year target columns...');
    
    await db.execute(sql`
      ALTER TABLE sireva.sasaran_program 
      ADD COLUMN IF NOT EXISTS target_2025 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS target_2026 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS target_2027 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS target_2028 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS target_2029 NUMERIC DEFAULT 0
    `);
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit(0);
}

migrate();
