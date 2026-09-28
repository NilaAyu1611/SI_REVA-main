import { db } from '../server/db';
import { rencanaAksi } from '../server/db/schema/rencana-aksi';
import { sasaranKegiatan } from '../server/db/schema/sasaran-kegiatan';
import { sasaranStrategis } from '../server/db/schema/sasaran-strategis';
import { sasaranProgram } from '../server/db/schema/sasaran-program';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.select({
      id: rencanaAksi.id,
      indikatorId: rencanaAksi.indikatorId,
      rencanaAksi: rencanaAksi.namaRencanaAksi,
      target: rencanaAksi.target,
      tw1: rencanaAksi.tw1,
      tw2: rencanaAksi.tw2,
      tw3: rencanaAksi.tw3,
      tw4: rencanaAksi.tw4,
      kegiatan: sasaranKegiatan.sasaranText,
      program: sasaranProgram.sasaranText,
      strategis: sasaranStrategis.sasaranText
    })
    .from(rencanaAksi)
    .leftJoin(sasaranKegiatan, eq(rencanaAksi.indikatorId, sasaranKegiatan.id))
    .leftJoin(sasaranProgram, eq(sasaranKegiatan.idSp, sasaranProgram.id))
    .leftJoin(sasaranStrategis, eq(sasaranProgram.idSs, sasaranStrategis.id));
    
    console.log('Query Success:', res.length, 'rows found');
    console.log(JSON.stringify(res.slice(0, 3), null, 2));
  } catch (error) {
    console.error('RAW ERROR:');
    console.error(error);
  }
}
main();
