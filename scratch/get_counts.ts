import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    const ss = await pool.query('SELECT count(*) FROM sireva.sasaran_strategis');
    const sp = await pool.query('SELECT count(*) FROM sireva.sasaran_program');
    const sk = await pool.query('SELECT count(*) FROM sireva.sasaran_kegiatan');
    console.log(JSON.stringify({ 
      ss: ss.rows[0].count, 
      sp: sp.rows[0].count, 
      sk: sk.rows[0].count 
    }));
    process.exit(0);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

run();
