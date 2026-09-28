import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const queries = [
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN unit_kerja TYPE varchar(1000)',
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN kode_iku TYPE varchar(1000)',
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN kode TYPE varchar(255)',
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN satuan TYPE varchar(255)',
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN sasaran_kegiatan_text TYPE text',
      // Ensure nullability
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN sasaran_kegiatan_text DROP NOT NULL',
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN id_ss DROP NOT NULL',
      'ALTER TABLE sireva.sasaran_kegiatan ALTER COLUMN id_sp DROP NOT NULL'
    ];

    for (const q of queries) {
      try {
        await pool.query(q);
      } catch (e: any) {
        console.log(`Query failed: ${q} - ${e.message}`);
      }
    }

    console.log('Successfully widened all columns in sasaran_kegiatan');
    process.exit(0);
  } catch (e: any) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
}

run();
