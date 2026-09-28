import 'dotenv/config';
import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Running migrations...');
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS sireva`);
    await db.execute(sql`ALTER TABLE sireva.sasaran_program ADD COLUMN IF NOT EXISTS unit_kerja VARCHAR(255)`);
    await db.execute(sql`ALTER TABLE sireva.sasaran_kegiatan ADD COLUMN IF NOT EXISTS unit_kerja VARCHAR(255)`);
    console.log('Success: Added unit_kerja to sasaran_program and sasaran_kegiatan');
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    process.exit(0);
  }
}

main();
