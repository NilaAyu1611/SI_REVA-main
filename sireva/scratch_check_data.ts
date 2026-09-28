import 'dotenv/config';
import { db } from './server/db';
import { sasaranProgram } from './server/db/schema/sasaran-program';

async function main() {
  const data = await db.select().from(sasaranProgram);
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

main();
