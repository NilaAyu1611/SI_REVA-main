import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function inspect() {
  try {
    console.log('Checking unique constraints / indexes on sireva.sasaran_program...');
    const res = await pool.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'sireva' AND tablename = 'sasaran_program';
    `);
    
    console.log('Indexes of sasaran_program:', res.rows);
    process.exit(0);
  } catch (err: any) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

inspect();
