import 'dotenv/config';
import { db } from './server/db';
import { unitKerja } from './server/db/schema/unit-kerja';

async function main() {
  const units = await db.select().from(unitKerja);
  console.log(JSON.stringify(units, null, 2));
  process.exit(0);
}

main();
