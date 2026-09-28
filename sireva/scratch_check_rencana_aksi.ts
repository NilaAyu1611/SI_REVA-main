import { db } from './server/db';
import { rencanaAksi } from './server/db/schema/rencana-aksi';

async function check() {
  const data = await db.select().from(rencanaAksi);
  console.log('Rencana Aksi Data:', JSON.stringify(data, null, 2));
  process.exit(0);
}

check();
