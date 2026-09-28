import { db } from './index'
import { users } from './schema/users'
import { eq, or } from 'drizzle-orm'

// Fungsi untuk mencari user berdasarkan username/email
type User = {
  id: number
  username: string | null
  password: string | null
  alias?: string | null
  role?: string | null
  role_id?: number | null
  unit_kerja?: string | null
  created_at?: Date | null
}

export async function getUserByUsernameOrEmail(username: string): Promise<User | null> {
  // Query Drizzle ORM hanya berdasarkan username
  const result = await db.select().from(users).where(
    eq(users.username, username)
  )
  return result[0] || null
}
