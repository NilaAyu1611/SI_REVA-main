import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`
      SELECT n.nspname AS schema_name, c.relname AS table_name, c.reltuples AS row_count
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = 'rencana_aksi'
    `);
    console.log(res.rows);
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}
main();
