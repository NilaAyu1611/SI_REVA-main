import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function introspect() {
  try {
    const tables = await db.execute(sql`
      SELECT table_schema, table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sasaran_program'
      ORDER BY table_schema, ordinal_position
    `);
    console.log('Tables found:', JSON.stringify(tables, null, 2));
  } catch (e) {
    console.error(e);
  }
}

introspect();
