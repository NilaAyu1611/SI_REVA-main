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
      SELECT column_name, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'sireva' AND table_name = 'sasaran_program' AND column_name = 'id'
    `);
    console.log('ID column default:', JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

check();
