import 'dotenv/config';
import { db } from '../server/db';
import { sasaranStrategis } from '../server/db/schema/sasaran-strategis';
import { sasaranProgram } from '../server/db/schema/sasaran-program';
import { sasaranKegiatan } from '../server/db/schema/sasaran-kegiatan';
import { isNull } from 'drizzle-orm';

async function check() {
  try {
    const ssList = await db.select({ id: sasaranStrategis.id, nama: sasaranStrategis.namaSs }).from(sasaranStrategis).where(isNull(sasaranStrategis.deletedAt));
    const spList = await db.select({ id: sasaranProgram.id, ssId: sasaranProgram.ssId, nama: sasaranProgram.namaSp }).from(sasaranProgram).where(isNull(sasaranProgram.deletedAt));
    const skList = await db.select({ id: sasaranKegiatan.id, spId: sasaranKegiatan.spId, nama: sasaranKegiatan.namaSk }).from(sasaranKegiatan).where(isNull(sasaranKegiatan.deletedAt));

    console.log('--- SASARAN STRATEGIS ---');
    console.log(ssList);

    console.log('\n--- SASARAN PROGRAM ---');
    console.log(spList);

    console.log('\n--- SASARAN KEGIATAN ---');
    console.log(skList);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
