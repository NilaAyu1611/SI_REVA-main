import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Checking columns of sireva.sasaran_program...');
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'sireva' AND table_name = 'sasaran_program';
    `);
    
    const columns = res.rows.map(r => r.column_name);
    console.log('Existing columns:', columns);

    if (columns.includes('kode_iku')) {
      console.log('Column "kode_iku" already exists in sireva.sasaran_program. No action needed.');
    } else if (columns.includes('kode_iku_sp')) {
      console.log('Column "kode_iku_sp" exists but "kode_iku" does not. Renaming "kode_iku_sp" to "kode_iku"...');
      await pool.query('ALTER TABLE sireva.sasaran_program RENAME COLUMN kode_iku_sp TO kode_iku;');
      console.log('Renamed successfully!');
    } else {
      console.log('Neither "kode_iku" nor "kode_iku_sp" exists. Adding "kode_iku" column...');
      await pool.query('ALTER TABLE sireva.sasaran_program ADD COLUMN kode_iku varchar(500);');
      console.log('Added "kode_iku" column successfully!');
    }

    // Ensure id_is column also exists
    if (!columns.includes('id_is')) {
      console.log('Adding missing column "id_is" to sireva.sasaran_program...');
      await pool.query('ALTER TABLE sireva.sasaran_program ADD COLUMN id_is integer;');
      console.log('Added "id_is" column successfully!');
    } else {
      console.log('Column "id_is" already exists.');
    }

    process.exit(0);
  } catch (err: any) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
