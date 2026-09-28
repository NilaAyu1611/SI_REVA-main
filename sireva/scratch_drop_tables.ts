import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Dropping conflicting tables...');
    await db.execute(sql`DROP TABLE IF EXISTS sireva.indikator_kinerja CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sireva.sasaran_kegiatan CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sireva.sasaran_program CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS sireva.sasaran_strategis CASCADE`);
    console.log('Tables dropped successfully.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  }
  process.exit(0);
}
main();
