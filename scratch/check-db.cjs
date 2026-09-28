const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.dtjrketxxozstcwvotzh:PAAYphUUf7KYz-2@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
});

async function test() {
  try {
    const res = await pool.query(`
      SELECT column_name, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_schema = 'sireva' AND table_name = 'indikator_strategis' AND column_name = 'satuan'
    `);
    console.log('Satuan Column Info:', res.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

test();
