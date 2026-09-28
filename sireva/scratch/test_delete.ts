import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testDelete() {
  try {
    const res = await pool.query(`
      DELETE FROM sireva.sasaran_program WHERE kode = 'SP.TEST2';
    `);
    console.log('Test row deleted successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('Failed to delete:', err);
    process.exit(1);
  }
}

testDelete();
