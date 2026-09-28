import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%rencana%' OR table_name LIKE '%aksi%';
    `);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}
main();
