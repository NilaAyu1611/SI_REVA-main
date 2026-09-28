import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`
      SELECT relname as table_name, n_live_tup as row_count
      FROM pg_stat_user_tables
      WHERE schemaname = 'sireva';
    `);
    console.table(res.rows);
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}
main();
