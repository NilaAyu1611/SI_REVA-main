import { db } from './server/db';
import { sasaranStrategis } from './server/db/schema/sasaran-strategis';
import { indikatorKegiatan as indikatorKinerja } from './server/db/schema/indikator-kegiatan';
import { sql, eq } from 'drizzle-orm';

async function restore() {
  try {
    // 1. Get all current sasaran strategis to map text to valid ID
    const validSasaran = await db.select().from(sasaranStrategis);
    const textToIdMap = new Map();
    validSasaran.forEach(s => textToIdMap.set(s.sasaranText, s.id));
    
    console.log('Valid Sasaran Map:', Array.from(textToIdMap.entries()));

    // Check for indicators with sasaranId that no longer exists
    // Note: Since we are using indikatorKegiatan (alias indikatorKinerja), 
    // the actual table is sireva.indikator_kegiatan
    const orphans = await db.execute(sql`
      SELECT ik.id, ik.id_sk, ik.nama_iku 
      FROM sireva.indikator_kegiatan ik
      LEFT JOIN sireva.sasaran_kegiatan sk ON ik.id_sk = sk.id
      WHERE sk.id IS NULL
    `);
    
    const orphanList = (Array.isArray(orphans) ? orphans : (orphans as any).rows);
    console.log('Found Orphans:', orphanList.length);

  } catch (err) {
    console.error('Error during restore:', err);
  }
  process.exit(0);
}

restore();
