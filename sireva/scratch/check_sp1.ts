import { db } from './server/db';
import { sasaranProgram } from './server/db/schema/sasaran-program';
import { eq } from 'drizzle-orm';

async function check() {
  const res = await db.select().from(sasaranProgram).where(eq(sasaranProgram.kode, 'SP1'));
  console.log('Records with kode SP1:', res.length);
  if (res.length > 0) {
    console.log('Existing record:', JSON.stringify(res[0], null, 2));
  }
  process.exit(0);
}

check();
