import { db } from './server/db';
import { sasaranProgram } from './server/db/schema/sasaran-program';

async function check() {
  const data = await db.select().from(sasaranProgram);
  console.log('Sasaran Program Data:', JSON.stringify(data, null, 2));
  process.exit(0);
}

check();
