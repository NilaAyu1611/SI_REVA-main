import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function queryRows() {
  try {
    const res = await pool.query(`
      SELECT id, kode, sasaran_kegiatan_text, indikator_kinerja, satuan, target_1, target_2
      FROM sireva.sasaran_kegiatan 
      LIMIT 10;
    `);
    
    console.log('Existing rows:', res.rows);
    process.exit(0);
  } catch (err: any) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

queryRows();
