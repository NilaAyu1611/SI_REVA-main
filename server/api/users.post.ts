import { db } from '../db/index'
import { users } from '../db/schema/users'
import { defineEventHandler, readBody, createError } from 'h3'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'Database not initialized' })
  }
  try {
    const body = await readBody(event)
    const { id, username, password, alias, unit_kerja, role_id, role } = body

    if (id) {
      // Edit User
      const updatedUser = await db.update(users)
        .set({
          username,
          ...(password ? { password } : {}),
          alias,
          unit_kerja,
          role_id: role_id ? parseInt(role_id, 10) : null,
          role
        })
        .where(eq(users.id, id))
        .returning()
      return updatedUser[0]
    } else {
      // Create User
      const newUser = await db.insert(users)
        .values({
          username,
          password,
          alias,
          unit_kerja,
          role_id: role_id ? parseInt(role_id, 10) : null,
          role
        })
        .returning()
      return newUser[0]
    }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to save user' })
  }
})
