import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'sireva' AND table_name = 'sasaran_kegiatan'
      ORDER BY ordinal_position
    `);
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

run();
