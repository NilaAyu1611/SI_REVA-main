import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('Adding monthly target columns to rencana_aksi...');
    await db.execute(sql`
      ALTER TABLE sireva.rencana_aksi 
      ADD COLUMN IF NOT EXISTS b01 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b02 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b03 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b04 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b05 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b06 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b07 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b08 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b09 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b10 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b11 NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS b12 NUMERIC DEFAULT 0
    `);
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit(0);
}

migrate();
