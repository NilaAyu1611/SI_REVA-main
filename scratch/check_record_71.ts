import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const res = await pool.query('SELECT * FROM sireva.sasaran_kegiatan WHERE id = 71');
    console.log(JSON.stringify(res.rows[0], null, 2));
    process.exit(0);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

run();
