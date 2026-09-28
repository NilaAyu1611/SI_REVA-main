import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function checkOrphan() {
  const orphans = await db.execute(sql`
    SELECT ik.id, ik.sasaran_id, ik.nama_indikator 
    FROM sireva.indikator_kinerja ik
    LEFT JOIN sireva.sasaran_strategis ss ON ik.sasaran_id = ss.id
    WHERE ss.id IS NULL
  `);
  console.log(orphans.rows || orphans);
  process.exit(0);
}
checkOrphan();
