import { db } from './server/db';
import { sasaranStrategis } from './server/db/schema/sasaran-strategis';

async function testSasaranInsert() {
  try {
    console.log("Attempting Sasaran insert...");
    const res = await db.insert(sasaranStrategis).values({
      tujuanId: 5,
      kode: 'SS-TEST',
      sasaranText: 'Meningkatnya akuntabilitas kinerja dan keuangan'
    }).returning();
    console.log("Success:", res);
  } catch (err: any) {
    console.error("DB Error Detail:", err.detail);
    console.error("Full Error:", err);
  }
  process.exit(0);
}

testSasaranInsert();
