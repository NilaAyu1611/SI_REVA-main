import { db } from '../server/db';
import { users } from '../server/db/schema/users';

async function main() {
  try {
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      role: users.role,
      role_id: users.role_id,
      unit_kerja: users.unit_kerja
    }).from(users);
    console.log('--- All Users ---');
    console.log(JSON.stringify(allUsers, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error running check script:', error);
    process.exit(1);
  }
}

main();
