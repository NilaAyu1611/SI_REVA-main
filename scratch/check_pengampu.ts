import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  const spPengampu = await db.execute(sql`SELECT DISTINCT pengampu FROM sireva.sasaran_program`);
  console.log("SP Pengampu:");
  console.log(spPengampu.rows);

  const skPengampu = await db.execute(sql`SELECT DISTINCT pengampu FROM sireva.sasaran_kegiatan`);
  console.log("SK Pengampu:");
  console.log(skPengampu.rows);
  
  process.exit(0);
}

main();
