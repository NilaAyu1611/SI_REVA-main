import * as dotenv from 'dotenv';
dotenv.config();
import { db } from '../server/db';
async function test() {
  try {
    const res = await db.execute('SELECT column_name FROM information_schema.columns WHERE table_schema = \'sireva\' AND table_name = \'sasaran_program\'');
    console.log(res.rows);
  } catch(e) {
    console.log(e);
  }
  process.exit(0);
}
test();
