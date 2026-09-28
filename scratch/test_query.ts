import { db } from '../server/db';
import { sasaranKegiatan } from '../server/db/schema/sasaran-kegiatan';
import { indikatorKinerja } from '../server/db/schema/indikator-kinerja';
import { sasaranProgram } from '../server/db/schema/sasaran-program';
import { eq, and, isNull, sql } from 'drizzle-orm';

async function main() {
  console.log('Testing query performance...');
  const start = Date.now();
  try {
    const selectFields = {
      id: sasaranKegiatan.id,
      spId: sasaranKegiatan.spId,
      nomorUrut: sasaranKegiatan.nomorUrut,
      kode: sasaranKegiatan.kodeSk,
      sasaranText: sasaranKegiatan.namaSk,
      sasaran_kegiatan_text: sasaranKegiatan.namaSk,
      unit_kerja: sasaranKegiatan.pengampu,
      unitKerjaNama: sasaranKegiatan.pengampu,
      programUnitKerja: sasaranProgram.pengampu,
      instansiTerkait: sasaranKegiatan.instansiTerkait,
      indikatorId: indikatorKinerja.id,
      indikatorNama: indikatorKinerja.namaIku,
      indikator_kinerja: indikatorKinerja.namaIku,
      satuan: indikatorKinerja.satuan,
      indikatorSatuan: indikatorKinerja.satuan,
      target_1: sql<string>`MAX(CASE WHEN tik.tahun = 2025 THEN tik.target_nilai END)`,
      target_2: sql<string>`MAX(CASE WHEN tik.tahun = 2026 THEN tik.target_nilai END)`,
      target_3: sql<string>`MAX(CASE WHEN tik.tahun = 2027 THEN tik.target_nilai END)`,
      target_4: sql<string>`MAX(CASE WHEN tik.tahun = 2028 THEN tik.target_nilai END)`,
      target_5: sql<string>`MAX(CASE WHEN tik.tahun = 2029 THEN tik.target_nilai END)`,
    };

    const result = await db.select(selectFields)
      .from(sasaranKegiatan)
      .leftJoin(indikatorKinerja, and(eq(sasaranKegiatan.id, indikatorKinerja.skId), isNull(indikatorKinerja.deletedAt)))
      .leftJoin(sasaranProgram, and(eq(sasaranKegiatan.spId, sasaranProgram.id), isNull(sasaranProgram.deletedAt)))
      .leftJoin(sql`sireva.target_indikator_kegiatan tik`, sql`tik.id_iku = ${indikatorKinerja.id}`)
      .where(isNull(sasaranKegiatan.deletedAt))
      .groupBy(
        sasaranKegiatan.id,
        sasaranKegiatan.spId,
        sasaranKegiatan.nomorUrut,
        sasaranKegiatan.kodeSk,
        sasaranKegiatan.namaSk,
        sasaranKegiatan.pengampu,
        sasaranProgram.pengampu,
        sasaranKegiatan.instansiTerkait,
        indikatorKinerja.id,
        indikatorKinerja.namaIku,
        indikatorKinerja.satuan
      )
      .orderBy(sasaranKegiatan.nomorUrut);

    console.log(`Query completed in ${Date.now() - start}ms. Retrieved ${result.length} rows.`);
  } catch (error) {
    console.error('Error running query:', error);
  }
  process.exit(0);
}

main();
