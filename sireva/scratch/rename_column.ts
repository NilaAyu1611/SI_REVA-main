import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await pool.query('ALTER TABLE sireva.sasaran_kegiatan RENAME COLUMN kode_iku TO indikator_kinerja');
    console.log('Successfully renamed kode_iku to indikator_kinerja');
  } catch (e: any) {
    console.log('Rename failed, checking if column exists:', e.message);
    await pool.query('ALTER TABLE sireva.sasaran_kegiatan ADD COLUMN IF NOT EXISTS indikator_kinerja varchar(1000)');
  }
  process.exit(0);
}

run();
