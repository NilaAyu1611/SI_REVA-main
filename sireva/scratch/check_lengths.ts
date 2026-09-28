import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkLengths() {
  const query = `
    SELECT column_name, character_maximum_length 
    FROM information_schema.columns 
    WHERE table_schema = 'sireva' AND table_name = 'sasaran_program'
  `;

  try {
    const res = await pool.query(query);
    console.log('Column Lengths:', JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err: any) {
    console.error('Check failed:', err.message);
    process.exit(1);
  }
}

checkLengths();
