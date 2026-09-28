import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function check() {
  try {
    const spuk = await db.execute(sql`SELECT * FROM sireva.sasaran_program_unit_kerja`);
    console.log('--- sasaran_program_unit_kerja ---');
    console.log(spuk.rows);

    const uk = await db.execute(sql`SELECT * FROM sireva.unit_kerja`);
    console.log('\n--- unit_kerja ---');
    console.log(uk.rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
