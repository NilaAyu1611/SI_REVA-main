import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Starting manual migration...');
  try {
    await db.execute(sql`ALTER TABLE sireva.indikator_kinerja ADD COLUMN IF NOT EXISTS unit_kerja varchar(255);`);
    console.log('Migration successful: added unit_kerja to indikator_kinerja');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrate();
