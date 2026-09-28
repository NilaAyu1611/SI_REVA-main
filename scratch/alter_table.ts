import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'sireva'
      ORDER BY table_name;
    `);
    console.log('Tables in sireva:', res.rows.map(r => r.table_name));
  } catch (error) {
    console.error('Failed to list tables:', error);
  }
  process.exit(0);
}

main();
