import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function inspect() {
  try {
    console.log('Checking columns of sireva.sasaran_kegiatan...');
    const res = await pool.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_schema = 'sireva' AND table_name = 'sasaran_kegiatan';
    `);
    
    console.log('Columns of sasaran_kegiatan:', res.rows);
    process.exit(0);
  } catch (err: any) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

inspect();
