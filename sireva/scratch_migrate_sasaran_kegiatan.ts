import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('Adding missing columns to sasaran_kegiatan...');
    
    await db.execute(sql`
      ALTER TABLE sireva.sasaran_kegiatan 
      ADD COLUMN IF NOT EXISTS nama_indikator TEXT,
      ADD COLUMN IF NOT EXISTS satuan VARCHAR(100),
      ADD COLUMN IF NOT EXISTS target NUMERIC DEFAULT 0
    `);
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit(0);
}

migrate();
