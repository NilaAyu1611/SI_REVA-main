import { db } from '../server/db';
import { laporanSasaranProgram } from '../server/db/schema/laporan-sasaran-program';
import { laporanSasaranKegiatan } from '../server/db/schema/laporan-sasaran-kegiatan';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Testing original and optimized queries...');
  const start1 = Date.now();
  
  // Original query
  const originalProgram = await db.select({
    realisasi: laporanSasaranProgram.realisasi,
    target: sql<number>`(select target from sireva.target_indikator_program tip where tip.indikator_id = ${laporanSasaranProgram.indikatorId} limit 1)`
  }).from(laporanSasaranProgram);
  
  console.log(`Original query took ${Date.now() - start1}ms. Rows: ${originalProgram.length}`);

  const start2 = Date.now();
  // Optimized query with LEFT JOIN and GROUP BY
  const optimizedProgram = await db.select({
    realisasi: laporanSasaranProgram.realisasi,
    target: sql<number>`MAX(tip.target)`
  })
  .from(laporanSasaranProgram)
  .leftJoin(sql`sireva.target_indikator_program tip`, sql`tip.indikator_id = ${laporanSasaranProgram.indikatorId}`)
  .groupBy(laporanSasaranProgram.id, laporanSasaranProgram.realisasi);

  console.log(`Optimized query took ${Date.now() - start2}ms. Rows: ${optimizedProgram.length}`);
  
  process.exit(0);
}

main();
