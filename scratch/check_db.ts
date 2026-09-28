import { db } from './server/db';
import { sasaranStrategis } from './server/db/schema/sasaran-strategis';
import { eq } from 'drizzle-orm';

async function check() {
  const res = await db.select().from(sasaranStrategis).where(eq(sasaranStrategis.id, 27));
  console.log('ID 27 exists:', res.length > 0);
  process.exit(0);
}

check();
