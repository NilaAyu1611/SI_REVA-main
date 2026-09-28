import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function check() {
  try {
    const res = await db.execute(sql`SELECT * FROM sireva.laporan_perjanjian_kinerja`);
    console.log(res.rows || res);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
check();
