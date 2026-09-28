import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`SELECT * FROM "sireva"."rencana_aksi"`);
    console.log(`Rows in sireva.rencana_aksi: ${res.rowCount}`);
    if (res.rowCount && res.rowCount > 0) {
      console.log(res.rows);
    }
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}
main();
