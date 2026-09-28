import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const dbUnits = await db.execute(sql`
      SELECT DISTINCT nama 
      FROM sireva.unit_kerja 
      WHERE nama IS NOT NULL AND nama != 'Kepala LAN'
      ORDER BY nama
    `);
    console.log("Loaded units count:", dbUnits.rows.length);
    console.log("First 3 units:", dbUnits.rows.slice(0, 3));
    process.exit(0);
  } catch (err) {
    console.error("Query failed:", err);
    process.exit(1);
  }
}
main();
