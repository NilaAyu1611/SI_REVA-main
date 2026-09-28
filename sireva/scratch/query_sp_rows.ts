import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function queryRows() {
  try {
    const res = await pool.query(`
      SELECT id, kode, sasaran_program_text, kode_iku, satuan, target_1, target_2
      FROM sireva.sasaran_program 
      LIMIT 10;
    `);
    
    console.log('Existing rows from sasaran_program:', res.rows);
    process.exit(0);
  } catch (err: any) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

queryRows();
