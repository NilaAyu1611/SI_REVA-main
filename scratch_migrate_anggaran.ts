import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('Adding anggaran column to sasaran_kegiatan...');
    await db.execute(sql`ALTER TABLE sireva.sasaran_kegiatan ADD COLUMN IF NOT EXISTS anggaran NUMERIC DEFAULT 0`);
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit(0);
}

migrate();
