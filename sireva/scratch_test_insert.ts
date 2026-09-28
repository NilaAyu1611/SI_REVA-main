import { db } from './server/db';
import { tujuan } from './server/db/schema/tujuan';

async function testInsert() {
  try {
    console.log("Attempting insert...");
    const res = await db.insert(tujuan).values({
      misiId: 1,
      kode: 'T-469',
      tujuanText: 'Peningkatan Koordinasi Perencanaan dan Keuangan'
    }).returning();
    console.log("Success:", res);
  } catch (err: any) {
    console.error("DB Error Code:", err.code);
    console.error("DB Error Detail:", err.detail);
    console.error("Full Error:", err);
  }
  process.exit(0);
}

testInsert();
