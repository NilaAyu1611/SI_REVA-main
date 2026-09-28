import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function main() {
  const result = await db.execute(sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'sireva' AND table_name = 'sasaran_program'`);
  console.log('sasaran_program cols:', result.rows);
  const result2 = await db.execute(sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'sireva' AND table_name = 'indikator_program'`);
  console.log('indikator_program cols:', result2.rows);
  process.exit(0);
}
main();
