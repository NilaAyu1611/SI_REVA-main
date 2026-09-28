import { pgTable, serial, varchar, integer, text, numeric, pgSchema } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { sql } from 'drizzle-orm';
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function check() {
  try {
    const res = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'sireva' AND table_name = 'sasaran_program'
      ORDER BY ordinal_position
    `);
    console.log('Columns in sasaran_program:', JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

check();
