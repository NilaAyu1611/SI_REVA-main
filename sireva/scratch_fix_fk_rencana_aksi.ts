import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    console.log('Updating foreign key for rencana_aksi to point to sasaran_kegiatan...');
    
    // Drop old foreign key if it exists
    await db.execute(sql`ALTER TABLE sireva.rencana_aksi DROP CONSTRAINT IF EXISTS rencana_aksi_indikator_id_fkey`);
    
    // Add new foreign key to sasaran_kegiatan
    await db.execute(sql`
      ALTER TABLE sireva.rencana_aksi 
      ADD CONSTRAINT rencana_aksi_indikator_id_fkey 
      FOREIGN KEY (indikator_id) 
      REFERENCES sireva.sasaran_kegiatan(id) 
      ON DELETE CASCADE
    `);
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
  process.exit(0);
}

migrate();
