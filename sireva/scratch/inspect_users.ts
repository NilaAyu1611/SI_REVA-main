import 'dotenv/config';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function check() {
  try {
    const users = await db.execute(sql`SELECT * FROM sireva.users`);
    console.log(users.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
