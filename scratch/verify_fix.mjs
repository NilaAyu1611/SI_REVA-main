import { db } from '../server/db/index';
import { users } from '../server/db/schema/users';
import { eq } from 'drizzle-orm';

async function test() {
  try {
    const query = db.select().from(users).where(eq(users.username, 'Admin')).toSQL();
    console.log('Generated SQL:');
    console.log(query.sql);
    console.log('Params:', query.params);

    const result = await db.select().from(users).where(eq(users.username, 'Admin'));
    console.log('Query result:', result);
  } catch (err) {
    console.error('Test failed:');
    console.error(err);
  }
}

test();
