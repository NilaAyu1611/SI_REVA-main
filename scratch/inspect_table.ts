import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function inspect() {
  try {
    const res = await pool.query(`
      SELECT * FROM sireva.sasaran_program LIMIT 5;
    `);
    console.log('Existing rows in sireva.sasaran_program:');
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err: any) {
    console.error('Failed to inspect:', err);
    process.exit(1);
  }
}

inspect();
