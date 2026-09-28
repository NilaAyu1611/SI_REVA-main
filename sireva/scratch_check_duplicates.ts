import { db } from './server/db';
import { unitKerja } from './server/db/schema/unit-kerja';
import { sql } from 'drizzle-orm';

async function check() {
  const all = await db.select().from(unitKerja);
  console.log('Total rows:', all.length);
  const uniqueIds = new Set(all.map(u => u.id));
  console.log('Unique IDs:', uniqueIds.size);
  if (all.length > uniqueIds.size) {
    console.log('DUPLICATES FOUND!');
  }
  process.exit(0);
}

check();
