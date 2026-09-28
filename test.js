import postgres from 'postgres';

const sql = postgres('postgresql://postgres.dtjrketxxozstcwvotzh:PAAYphUUf7KYz-2@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');

async function test() {
  try {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'sireva' AND table_name LIKE '%target%'`;
    console.log("Tables:", res.map(r => r.table_name).join(', '));
  } catch(e) {
    console.error("Query Failed:", e.message);
  } finally {
    await sql.end();
  }
}
test();
