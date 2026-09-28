import { db } from '../server/db';
import { targetIndikatorProgram } from '../server/db/schema/target-indikator-program';

async function checkData() {
  try {
    const data = await db.select().from(targetIndikatorProgram);
    console.log('Targets:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

checkData();
