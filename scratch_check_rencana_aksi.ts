import 'dotenv/config';
import { db } from './server/db';
import { unitKerja } from './server/db/schema/unit-kerja';

async function check() {
  const data = await db.select({
    id: unitKerja.id,
    nama: unitKerja.nama
  }).from(unitKerja);

  console.log('Unit Kerja Data:', JSON.stringify(data, null, 2));
  process.exit(0);
}

check();
