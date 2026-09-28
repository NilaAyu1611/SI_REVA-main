import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function clean() {
  try {
    const res = await db.execute(sql`SELECT MIN(id) as id FROM sireva.sasaran_strategis GROUP BY sasaran_text`);
    const keepIds = (Array.isArray(res) ? res : (res as any).rows).map((r: any) => r.id);
    
    console.log('Keeping IDs:', keepIds);
    
    if (keepIds.length > 0) {
      await db.execute(sql`DELETE FROM sireva.sasaran_strategis WHERE id NOT IN (${sql.raw(keepIds.join(','))})`);
      console.log('Deduplication successful.');
    }
  } catch (err) {
    console.error('Error during cleaning:', err);
  }
  process.exit(0);
}

clean();
