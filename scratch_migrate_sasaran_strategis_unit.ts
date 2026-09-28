import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('Adding unit_kerja column to sasaran_strategis...');
    
    await db.execute(sql`
      ALTER TABLE sireva.sasaran_strategis 
      ADD COLUMN IF NOT EXISTS unit_kerja VARCHAR(255) DEFAULT 'Kepala LAN RI'
    `);
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit(0);
}

migrate();
