import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Altering unique indexes/constraints to allow multiple indicators...');
    
    // 1. Drop strict unique constraint/index on sasaran_kegiatan(kode)
    console.log('Checking and dropping sasaran_kegiatan_kode_key...');
    await pool.query(`
      ALTER TABLE sireva.sasaran_kegiatan DROP CONSTRAINT IF EXISTS sasaran_kegiatan_kode_key CASCADE;
    `);
    await pool.query(`
      DROP INDEX IF EXISTS sireva.sasaran_kegiatan_kode_key CASCADE;
    `);
    
    // 2. Drop strict unique constraint/index on sasaran_program(kode)
    console.log('Checking and dropping sasaran_program_kode_key...');
    await pool.query(`
      ALTER TABLE sireva.sasaran_program DROP CONSTRAINT IF EXISTS sasaran_program_kode_key CASCADE;
    `);
    await pool.query(`
      DROP INDEX IF EXISTS sireva.sasaran_program_kode_key CASCADE;
    `);

    // 3. Re-create them as standard indexes (non-unique) for search performance
    console.log('Creating standard non-unique indexes for performance...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sasaran_kegiatan_kode ON sireva.sasaran_kegiatan(kode);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sasaran_program_kode ON sireva.sasaran_program(kode);
    `);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
